import {apiRequest} from "@/lib/api/client";
import {ENDPOINTS} from "@/lib/constants";

export const promoteUser: (schoolId: number, userId: number) => Promise<any> = (schoolId:number, userId: number) =>
    apiRequest(ENDPOINTS.PROMOTE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({userId})
    });
export const demoteUser: (schoolId: number, userId: number) => Promise<any> = (schoolId:number, userId: number) =>
    apiRequest(ENDPOINTS.DEMOTE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({userId})
    });
export const logout2: () => Promise<any> = () =>
    apiRequest(ENDPOINTS.LOGOUT, {
        method: 'GET'
    });
export const getAllSchoolUsers: (schoolId:number) => Promise<any> = (schoolId:number) =>
    apiRequest(ENDPOINTS.LIST_ALL_SCHOOL_USERS+`?schoolId=${schoolId}`, {
        method: 'GET'
    });

