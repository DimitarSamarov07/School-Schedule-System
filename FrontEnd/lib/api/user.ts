import {apiRequest} from "@/lib/api/client";
import {ENDPOINTS} from "@/lib/constants";

export const login: (username: string, password: string, deviceName: string) => Promise<void> = (username: string, password: string, deviceName: string) =>
    apiRequest(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({username, password, deviceName}),
    });
export const register: (username: string,email: string, password: string, isAdmin: boolean) => Promise<void> = (username: string,email: string, password: string, isAdmin: boolean) =>
    apiRequest(ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({username, password,email, isAdmin}),
    });
export const logout: () => Promise<void> = () =>
    apiRequest(ENDPOINTS.LOGOUT, {
        method: 'GET'
    });

export const inviteUserToSchool = (schoolId: number, username: string): Promise<void> =>
    apiRequest(ENDPOINTS.INVITE_USER+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ username }),
    });

export const removeUserFromSchool = (schoolId: number, userId: number): Promise<void> =>
    apiRequest(ENDPOINTS.REMOVE_USER+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });





