import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Time} from "@/types/time";

export const getPeriodsForSchool: (schoolId: number) => Promise<Time[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.TIME+`?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createPeriod = (schoolId: number,name: string,start: string, end: string)=>
    apiRequest(ENDPOINTS.TIME+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name,start, end})
    });
export const updateTime = (id: number,name: string, start?: string, end?: string) =>
    apiRequest(ENDPOINTS.TIME+`?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            ...(name && { name }),
            ...(start && { start }),
            ...(end && { end }),
        }),
    });
export const deletePeriod = (id: number) =>
    apiRequest(`${ENDPOINTS.TIME}?id=${id}`, {
        method: 'DELETE',
    });


