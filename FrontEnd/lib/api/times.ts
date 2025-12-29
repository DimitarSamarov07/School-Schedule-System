import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Time} from "@/types/time";

export const getTimes: () => Promise<Time[]> = () =>
    apiRequest(ENDPOINTS.TIME, {
        method: 'GET'
    });

export const createTime = (start: string, end: string)=>
    apiRequest(ENDPOINTS.TIME, {
        method: 'POST',
        body: JSON.stringify({start, end})
    });
export const updateTime = (id: string | number, start?: string, end?: string) =>
    apiRequest(ENDPOINTS.TIME, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(start && { start }),
            ...(end && { end }),
        }),
    });
export const deleteTime = (id: string | number) =>
    apiRequest(`${ENDPOINTS.TIME}?id=${id}`, {
        method: 'DELETE',
    });


