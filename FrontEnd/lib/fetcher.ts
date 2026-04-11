import { apiRequest } from '@/lib/api/client';

const fetcher = async (endpoint: string) => {
    // SWR will automatically pass the endpoint string into this function.
    // We use your new apiRequest wrapper to handle CSRF tokens, credentials, and 401 retries.
    // We pass '0' as the third argument to disable the client.ts memory cache
    // because SWR does a much better job of handling caching on its own!
    return await apiRequest<never>(endpoint, { method: 'GET' }, 0);
};

export default fetcher;