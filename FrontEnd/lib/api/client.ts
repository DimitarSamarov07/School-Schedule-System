import { BASE_URL } from '@/lib/constants';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
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

        return await response.json();

    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error(`[API] Timeout at ${endpoint}. Request took longer than 5s.`);
            return [] as unknown as T;
        }

        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error(`[API] Network Error at ${endpoint}. Check CORS or Server status.`);
            return [] as unknown as T;
        }

        throw error;
    }
}