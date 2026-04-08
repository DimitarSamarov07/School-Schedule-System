// hooks/useApiRequest.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { apiRequest, onCacheInvalidated } from '@/lib/api/client';

export function useApiRequest<T>(endpoint: string, cacheTTL?: number) {
    const [data, setData]       = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await apiRequest<T>(endpoint, {}, cacheTTL);
            setData(result);
            setError(null);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [endpoint, cacheTTL]);

    // Keep a ref so the subscription always calls the latest fetchData
    // without needing it as a dependency (breaks the loop)
    const fetchDataRef = useRef(fetchData);
    useEffect(() => {
        fetchDataRef.current = fetchData;
    }, [fetchData]);

    // Initial fetch — only re-runs if endpoint or cacheTTL changes
    useEffect(() => {
        fetchDataRef.current();
    }, [endpoint, cacheTTL]);

    // Subscription — only re-runs if endpoint changes
    useEffect(() => {
        const unsubscribe = onCacheInvalidated((invalidatedEndpoint) => {
            if (invalidatedEndpoint === endpoint || invalidatedEndpoint === '*') {
                fetchDataRef.current();
            }
        });
        return unsubscribe;
    }, [endpoint]); // ← no fetchData dependency here

    return { data, loading, error, refetch: fetchData };
}