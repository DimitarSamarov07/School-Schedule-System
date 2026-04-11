'use client';

import { useEffect } from 'react';
import { ensureCsrfToken } from '@/lib/api/client';

export function CsrfProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        // Fire the pre-fetch in the background.
        // ensureCsrfToken is smart enough to bypass the cache and only fetch if needed!
        ensureCsrfToken().catch(err => console.error("CSRF Pre-fetch failed:", err));
    }, []);

    // Remove the `if (!isReady) return null`;
    // We want the app to load instantly. If an API request fires before the token arrives,
    // client.ts will automatically pause the request and wait for it.
    return <>{children}</>;
}