import { BASE_URL } from '@/constants/endpoints';
import { getCSRFToken, performTokenRefresh } from './auth';

// ─── CSRF STATE ────────────────────────────────────────────────────────────────

let memoizedCsrfToken: string | null = null;
let resolveCsrfReady: () => void;
let csrfReadyPromise = makeCsrfGate();
let isFetchingCsrf = false;

function makeCsrfGate() {
    return new Promise<void>((resolve) => {
        resolveCsrfReady = resolve;
    });
}

export const setCsrfToken = (token: string) => {
    memoizedCsrfToken = token;
    resolveCsrfReady();
};

export const invalidateCsrfToken = () => {
    memoizedCsrfToken = null;
    csrfReadyPromise = makeCsrfGate();
};

export async function ensureCsrfToken() {
    if (memoizedCsrfToken) return;

    if (isFetchingCsrf) {
        await csrfReadyPromise;
        return;
    }

    isFetchingCsrf = true;
    try {
        const res = await getCSRFToken();
        setCsrfToken(res.csrfToken);
    } catch (e) {
        console.error("Failed to fetch CSRF token", e);
    } finally {
        isFetchingCsrf = false;
    }
}

// ─── CACHE EVENT BUS ───────────────────────────────────────────────────────────

type InvalidationListener = (endpoint: string) => void;
const invalidationListeners = new Set<InvalidationListener>();

export function onCacheInvalidated(cb: InvalidationListener): () => void {
    invalidationListeners.add(cb);
    return () => invalidationListeners.delete(cb);
}

// ─── IN-FLIGHT DEDUPLICATION ───────────────────────────────────────────────────

const inFlight = new Map<string, Promise<unknown>>();

// ─── RESPONSE CACHE ────────────────────────────────────────────────────────────

interface CacheEntry {
    data: unknown;
    expiresAt: number;
}

const memCache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 30_000; // 30 seconds

export function invalidateCache(endpoint: string) {
    memCache.delete(`GET:${endpoint}`);
    invalidationListeners.forEach((cb) => cb(endpoint));
}

export function invalidateCacheByPrefix(prefix: string) {
    for (const key of memCache.keys()) {
        if (key.includes(prefix)) {
            memCache.delete(key);
            invalidationListeners.forEach((cb) => cb(prefix));
        }
    }
}

export function invalidateCacheAll() {
    memCache.clear();
    invalidationListeners.forEach((cb) => cb('*'));
}

// ─── CORE API WRAPPER ──────────────────────────────────────────────────────────

export async function apiRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    cacheTTL = DEFAULT_TTL,
): Promise<T> {
    const isCsrfHandshake = endpoint.startsWith('/csrf-token');
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const cacheKey = `${options.method?.toUpperCase() ?? 'GET'}:${endpoint}`;

    // GUARANTEE WE HAVE A TOKEN BEFORE PROCEEDING
    if (!isCsrfHandshake) {
        await ensureCsrfToken();
    }

    if (isGet && cacheTTL > 0) {
        const hit = memCache.get(cacheKey);
        if (hit && Date.now() < hit.expiresAt) {
            return hit.data as T;
        }
    }

    if (isGet && inFlight.has(cacheKey)) {
        return inFlight.get(cacheKey) as Promise<T>;
    }

    const promise = executeRequest<T>(endpoint, options, false)
        .then((data) => {
            if (isGet && cacheTTL > 0) {
                memCache.set(cacheKey, { data, expiresAt: Date.now() + cacheTTL });
            }
            return data;
        })
        .finally(() => {
            inFlight.delete(cacheKey);
        });

    if (isGet) inFlight.set(cacheKey, promise);

    return promise;
}

// ─── RAW FETCH EXECUTOR ────────────────────────────────────────────────────────

async function executeRequest<T>(endpoint: string, options: RequestInit, isRetry: boolean): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const headers = new Headers(options.headers);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        // Inject CSRF token from a local state
        if (memoizedCsrfToken) {
            headers.set('x-csrf-token', memoizedCsrfToken);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // 401 Interceptor bypasses /auth/refresh to prevent loops
            if ((response.status === 401 || response.status === 403) && !isRetry && endpoint !== '/auth/refresh') {
                try {
                    await performTokenRefresh();
                    return await executeRequest<T>(endpoint, options, true); // RETRY
                } catch (refreshError) {
                    throw { error: "Сесията изтече. Моля, влезте отново.", errorType: "auth" };
                }
            }

            throw await response.json().catch(() => ({
                error: "Network error or invalid JSON response"
            }));
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }

        return {} as T;

    } catch (error) {
        clearTimeout(timeoutId);
        // @ts-expect-error - Catching AbortController timeout
        if (error.name === 'AbortError') {
            console.error(`[API] Timeout reaching ${endpoint}`);
        }
        throw error;
    }
}