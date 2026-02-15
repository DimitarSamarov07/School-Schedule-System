import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Subject} from "@/types/subject";

export const getSubjects: (schoolId: number) => Promise<Subject[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.SUBJECTS+`/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createSubject = (schoolId: number,name: string, description: string)=>
    apiRequest(ENDPOINTS.SUBJECTS+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, description})
    });
export const updateSubject = (schoolId: number,id: number, name?: string, description?: string) =>
    apiRequest(ENDPOINTS.SUBJECTS+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(description && { description }),
        }),
    });
export const deleteSubject = (id: number,schoolId: number) =>
    apiRequest(`${ENDPOINTS.SUBJECTS}?id=${id}&&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


