import { BASE_URL } from '@/lib/constants';
import router from 'next/router';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        router.push('/login');
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
}