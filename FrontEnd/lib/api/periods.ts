import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Time} from "@/types/time";

export const getPeriodsForSchool: (schoolId: number) => Promise<Time[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.PERIOD+`/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createPeriod = (schoolId: number,name: string,start: string, end: string)=>
    apiRequest(ENDPOINTS.PERIOD+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name,start, end})
    });
export const updateTime = (schoolId: number,id: number, name: string | undefined, start?: string | undefined, end?: string | undefined) =>
    apiRequest(ENDPOINTS.PERIOD+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(start && { start }),
            ...(end && { end }),
        }),
    });
export const deletePeriod = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.PERIOD}?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


