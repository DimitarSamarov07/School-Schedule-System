'use client';
import { useEffect, useState } from 'react';
import { apiRequest, setCsrfToken } from '@/lib/api/client';

export function CsrfProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initCsrf = async () => {
            try {
                const data = await apiRequest<{ csrfToken: string }>('/csrf-token');

                setCsrfToken(data.csrfToken);
                setIsReady(true);
            } catch (err) {
                console.error("CSRF Init Failed:", err);
            }
        };
        initCsrf();
    }, []);
    if (!isReady) return null;

    return <>{children}</>;
}