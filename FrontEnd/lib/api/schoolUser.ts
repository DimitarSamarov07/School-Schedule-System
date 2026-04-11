import {apiRequest} from "@/lib/api/client";
import {ENDPOINTS} from "@/constants/endpoints";

export const promoteUser: (schoolId: number, userId: number) => Promise<any> = (schoolId:number, userId: number) =>
    apiRequest(ENDPOINTS.USER.PROMOTE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({userId})
    });
export const demoteUser: (schoolId: number, userId: number) => Promise<any> = (schoolId:number, userId: number) =>
    apiRequest(ENDPOINTS.USER.DEMOTE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({userId})
    });
export const getAllSchoolUsers: (schoolId:number) => Promise<any> = (schoolId:number) =>
    apiRequest(ENDPOINTS.SCHOOL.LIST_ALL_SCHOOL_USERS+`?schoolId=${schoolId}`, {
        method: 'GET'
    });


export const inviteUserToSchool = (schoolId: number, username: string): Promise<void> =>
    apiRequest(ENDPOINTS.USER.INVITE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ username }),
    });

export const removeUserFromSchool = (schoolId: number, userId: number): Promise<void> =>
    apiRequest(ENDPOINTS.USER.REMOVE+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });

