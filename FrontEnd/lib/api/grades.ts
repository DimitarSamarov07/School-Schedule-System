import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";

export const getGrades = () =>
    apiRequest(ENDPOINTS.CLASS, {
        method: 'GET'
    });

export const createGrade = (name: string, description: string)=>
    apiRequest(ENDPOINTS.CLASS, {
        method: 'POST',
        body: JSON.stringify({name, description})
    });
export const updateGrade = (id: string | number, name?: string, description?: string) =>
    apiRequest(ENDPOINTS.CLASS, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(description && { description }),
        }),
    });
export const deleteGrade = (id: string | number) =>
    apiRequest(`${ENDPOINTS.CLASS}?id=${id}`, {
        method: 'DELETE',
    });


