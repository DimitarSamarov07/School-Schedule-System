import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Date} from "@/types/date";

export const getDates: () => Promise<Date[]> = () =>
    apiRequest(ENDPOINTS.DATE, {
        method: 'GET'
    });

export const createDate = (date: string, isHoliday: boolean)=>
    apiRequest(ENDPOINTS.DATE, {
        method: 'POST',
        body: JSON.stringify({date, isHoliday})
    });
export const updateDate = (id: string | number, date?: string, isHoliday?: boolean) =>
    apiRequest(ENDPOINTS.DATE, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(date && { date }),
            ...(isHoliday && { isHoliday }),
        }),
    });
export const deleteDate = (id: string | number) =>
    apiRequest(`${ENDPOINTS.DATE}?id=${id}`, {
        method: 'DELETE',
    });


