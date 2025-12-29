import { BASE_URL } from '@/lib/constants';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // 1. Handle 404 (Endpoint not implemented yet)
        if (response.status === 404) {
            console.warn(`[API] 404 at ${endpoint}. Returning empty data.`);
            // Return empty array or null safely
            return [] as unknown as T;
        }

        // 2. Handle other Server Errors (500, 401, etc.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Status ${response.status}`);
        }

        // 3. Success - Parse JSON
        return await response.json();

    } catch (error: any) {
        // 4. Handle Network Failures (The "Failed to Fetch" error)
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.warn(`[API] Network Error at ${endpoint}. Check CORS or Server status.`);
            // If the network is down, we must return something so the UI stops "waiting"
            return [] as unknown as T;
        }

        // Re-throw actual logic errors so you can see them in console
        throw error;
    }
}