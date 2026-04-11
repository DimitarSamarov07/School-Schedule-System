import { apiRequest, ensureCsrfToken, invalidateCsrfToken } from "@/lib/api/client";
import { ENDPOINTS } from "@/constants/endpoints";
import Cookies from "js-cookie";

// ─── STANDARD AUTH ENDPOINTS ───────────────────────────────────────────────────

export const login = (username: string, password: string, deviceName: string): Promise<void> =>
    apiRequest(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password, deviceName }),
    });

export const register = (username: string, email: string, password: string, isAdmin: boolean): Promise<void> =>
    apiRequest(ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ username, password, email, isAdmin }),
    });

export const logout = (): Promise<void> =>
    apiRequest(ENDPOINTS.LOGOUT, {
        method: 'GET'
    });

// ─── CSRF FETCH LOGIC ──────────────────────────────────────────────────────────

export const getCSRFToken = (): Promise<{ csrfToken: string }> =>
    apiRequest<{ csrfToken: string }>(
        `/csrf-token?t=${Date.now()}`,
        {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        },
        0 // Force bypass of the memCache
    );

// ─── TOKEN REFRESH LOGIC ───────────────────────────────────────────────────────

// Holds the active refresh promise so multiple failed requests don't trigger multiple refreshes
let refreshPromise: Promise<void> | null = null;

export async function performTokenRefresh(): Promise<void> {
    // If a refresh is already in progress, wait for it to finish instead of starting a new one
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const refreshToken = Cookies.get('REFRESH_TOKEN');

            if (!refreshToken) {
                throw new Error("No refresh token found");
            }

            const data = await apiRequest<{ token?: string, accessToken?: string }>(
                ENDPOINTS.AUTH.REFRESH,
                {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken })
                },
                0 // Bypass cache
            );

            const newAuthToken = data.token || data.accessToken;

            if (newAuthToken) {
                Cookies.set('AUTH_TOKEN', newAuthToken);
                invalidateCsrfToken();
                await ensureCsrfToken();
            }

        } finally {
            // Clear the lock once the refresh is complete or fails
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}