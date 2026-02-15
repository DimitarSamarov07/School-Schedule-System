import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Holiday} from "@/types/holiday";

export const getHoliday: (schoolId: number) => Promise<Holiday[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.HOLIDAY+`/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createDate = (schoolId:number,name: string,startDate: string, endDate: string)=>
    apiRequest(ENDPOINTS.HOLIDAY+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, startDate, endDate})
    });
export const updateDate = (schoolId: number,id: number, name?: string, start?: string, end?: string) =>
    apiRequest(ENDPOINTS.HOLIDAY+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(start && { start }),
            ...(end && { end }),
            ...(name && { name }),
        }),
    });
export const deleteDate = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.HOLIDAY}?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


