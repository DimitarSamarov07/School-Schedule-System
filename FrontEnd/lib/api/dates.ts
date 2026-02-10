import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Holiday} from "@/types/holiday";

export const getHoliday: (schoolId: number) => Promise<Holiday[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.HOLIDAY+`?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createDate = (name: string,start: string, end: string)=>
    apiRequest(ENDPOINTS.HOLIDAY+`?schoolId=`, {
        method: 'POST',
        body: JSON.stringify({name, start, end})
    });
export const updateDate = (id: number, name?: string, start?: string, end?: string) =>
    apiRequest(ENDPOINTS.HOLIDAY, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(start && { start }),
            ...(end && { end }),
            ...(name && { name }),
        }),
    });
export const deleteDate = (id: string | number) =>
    apiRequest(`${ENDPOINTS.HOLIDAY}?id=${id}`, {
        method: 'DELETE',
    });


