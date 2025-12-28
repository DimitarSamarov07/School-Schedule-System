import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";

export const getSubject = () =>
    apiRequest("/room", {
        method: 'GET'
    });

export const createSubject = (name: string, color: string)=>
    apiRequest(ENDPOINTS.ROOM, {
        method: 'POST',
        body: JSON.stringify({name, color})
    });
export const updateSubject = (id: string | number, name?: string, color?: string) =>
    apiRequest(ENDPOINTS.ROOM, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(color && { color }),
        }),
    });
export const deleteSubject = (id: string | number) =>
    apiRequest(`${ENDPOINTS.SUBJECTS}?id=${id}`, {
        method: 'DELETE',
    });


