import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Subject} from "@/types/subject";

export const getSubjects: () => Promise<Subject[]> = () =>
    apiRequest(ENDPOINTS.SUBJECTS, {
        method: 'GET'
    });

export const createSubject = (name: string, color: string)=>
    apiRequest(ENDPOINTS.SUBJECTS, {
        method: 'POST',
        body: JSON.stringify({name, color})
    });
export const updateSubject = (id: string | number, name?: string, color?: string) =>
    apiRequest(ENDPOINTS.SUBJECTS, {
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


