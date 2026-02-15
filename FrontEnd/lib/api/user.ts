import {apiRequest} from "@/lib/api/client";
import {ENDPOINTS} from "@/lib/constants";


export const login: (username: string, password: string) => Promise<any> = (username: string, password: string) =>
    apiRequest(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({username, password}),
    });
export const register: (schoolId: number,username: string,email: string, password: string, isAdmin: boolean) => Promise<any> = (schoolId: number,username: string,email: string, password: string, isAdmin: boolean) =>
    apiRequest(ENDPOINTS.REGISTER+`schoolId:${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({username, password,email, isAdmin}),
    });
export const logout: () => Promise<any> = () =>
    apiRequest(ENDPOINTS.LOGOUT, {
        method: 'GET'
    });


