import { BASE_URL } from '@/lib/constants';

/**
 * SHARED STATE
 */
let memoizedCsrfToken: string | null = null;

// The "Lock" mechanism
let resolveCsrfReady: () => void;
const csrfReadyPromise = new Promise<void>((resolve) => {
    resolveCsrfReady = resolve;
});

/**
 * Updates the internal token and unlocks any pending requests.
 */
export const setCsrfToken = (token: string) => {
    memoizedCsrfToken = token;
    resolveCsrfReady();
};

/**
 * CORE API WRAPPER
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isCsrfHandshake = endpoint === '/csrf-token';

    if (!isCsrfHandshake && !memoizedCsrfToken) {
        await csrfReadyPromise;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

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
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
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