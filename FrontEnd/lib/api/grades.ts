import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Grade} from "@/types/grade";

export const getGrades: (schoolId: number) => Promise<Grade[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.CLASS+`/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createGrade = (schoolId: number,name: string, description: string,homeroomId: number)=>
    apiRequest(ENDPOINTS.CLASS+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, description,homeroomId})
    });
export const updateGrade = (schoolId:  number,id: number, name?: string, description?: string, homeroomId?: number) =>
    apiRequest(ENDPOINTS.CLASS+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(description && { description }),
            ...(homeroomId && { homeroomId }),
        }),
    });
export const deleteGrade = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.CLASS}?id=${id}&&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


