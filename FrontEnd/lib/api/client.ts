import { BASE_URL } from '@/lib/constants';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            // CRITICAL: Tells the browser to handle the JWT cookie
            credentials: 'include',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (response.status === 404) {
            console.warn(`[API] 404 at ${endpoint}. Returning empty data.`);
            return [] as unknown as T;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Status ${response.status}`);
        }

        // Check if there is content to parse to avoid JSON.parse errors
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        return {} as T;

    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error(`[API] Timeout at ${endpoint}.`);
            return [] as unknown as T;
        }

        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error(`[API] Network Error. Check CORS or Server status.`);
            return [] as unknown as T;
        }

        throw error;
    }
}