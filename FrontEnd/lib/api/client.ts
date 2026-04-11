import { BASE_URL } from '@/lib/constants';
import Cookies from 'js-cookie';

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

// Autonomously fetches the CSRF token if it's missing
// Autonomously fetches the CSRF token if it's missing
export async function ensureCsrfToken() {
    if (memoizedCsrfToken) return; // We already have it

    if (isFetchingCsrf) {
        await csrfReadyPromise; // Another request is already fetching it, just wait
        return;
    }

    isFetchingCsrf = true;
    try {

        const url = `/csrf-token?t=${Date.now()}`;

        const res = await executeRequest<{csrfToken: string}>(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }, false);

        setCsrfToken(res.csrfToken);
    } catch (e) {
        console.error("❌ Failed to fetch CSRF token", e);
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

const inFlight = new Map<string, Promise<any>>();

// ─── RESPONSE CACHE ────────────────────────────────────────────────────────────

interface CacheEntry {
    data: any;
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

// ─── TOKEN REFRESH STATE ───────────────────────────────────────────────────────

let refreshPromise: Promise<void> | null = null;

async function performTokenRefresh(): Promise<void> {
    try {
        const refreshToken = Cookies.get('REFRESH_TOKEN');

        if (!refreshToken) {
            throw new Error("No refresh token found");
        }

        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(memoizedCsrfToken ? { 'x-csrf-token': memoizedCsrfToken } : {})
            },
            body: JSON.stringify({ refreshToken })
        });

        if (!res.ok) {
            throw new Error("Refresh token expired or invalid");
        }

        const data = await res.json();
        const newAuthToken = data.token || data.accessToken;

        if (newAuthToken) {
            Cookies.set('AUTH_TOKEN', newAuthToken);
            invalidateCsrfToken();
            await ensureCsrfToken();
        }

    } finally {
        refreshPromise = null;
    }
}

// ─── CORE API WRAPPER ──────────────────────────────────────────────────────────

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheTTL = DEFAULT_TTL,
): Promise<T> {
    const isCsrfHandshake = endpoint === '/csrf-token';
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
            // ─── 401 INTERCEPTOR ───
            if ((response.status === 401 || response.status === 403) && !isRetry && endpoint !== '/user/refresh') {
                if (!refreshPromise) {
                    refreshPromise = performTokenRefresh();
                }

                try {
                    await refreshPromise;
                    return await executeRequest<T>(endpoint, options, true); // RETRY
                } catch (refreshError) {
                    // Redirect to login if the refresh fails completely
                        // if (typeof window !== 'undefined') {
                        //     window.location.href = '/auth';
                        // }
                    throw { error: "Сесията изтече. Моля, влезте отново.", errorType: "auth" };
                }
            }

            const errorData = await response.json().catch(() => ({
                error: "Network error or invalid JSON response"
            }));

            throw errorData;
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }

        return {} as T;

    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error(`[API] Timeout reaching ${endpoint}`);
        }
        throw error;
    }
}