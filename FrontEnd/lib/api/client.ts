import { BASE_URL } from '@/lib/constants';

// ─── CSRF STATE ────────────────────────────────────────────────────────────────

let memoizedCsrfToken: string | null = null;
let resolveCsrfReady: () => void;
let csrfReadyPromise = makeCsrfGate();

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
// Add this to your apiRequest client file
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

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheTTL = DEFAULT_TTL,
): Promise<T> {
    const isCsrfHandshake = endpoint === '/csrf-token';
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const cacheKey = `${options.method?.toUpperCase() ?? 'GET'}:${endpoint}`;

    if (!isCsrfHandshake && !memoizedCsrfToken) {
        await csrfReadyPromise;
    }

    // 1. Return from memory cache if still fresh (GET only)
    if (isGet && cacheTTL > 0) {
        const hit = memCache.get(cacheKey);
        if (hit && Date.now() < hit.expiresAt) {
            return hit.data as T;
        }
    }

    // 2. Return the existing in-flight promise to deduplicate parallel requests
    if (isGet && inFlight.has(cacheKey)) {
        return inFlight.get(cacheKey) as Promise<T>;
    }

    // 3. Fire the actual request
    const promise = executeRequest<T>(endpoint, options)
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

async function executeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
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
            const errorData = await response.json().catch(() => ({}));
            console.log(errorData.details[0].message);
            for (let i = 0; i < errorData.details.length; i++ ){
                 new Error(errorData.details[0].message);
            }
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