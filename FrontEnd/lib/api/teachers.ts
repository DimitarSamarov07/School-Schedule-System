import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Teacher} from "@/types/teacher";


export const getTeachers: (schoolId: number) => Promise<Teacher[]> = (schoolId: number) =>
    apiRequest(`/teacher/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createTeacher= (schoolId: number,name: string, email: string)=>
    apiRequest(ENDPOINTS.TEACHER+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, email})
    });
export const updateTeacher = (schoolId: number,id: number, name?: string, email?: string) =>
    apiRequest(ENDPOINTS.TEACHER+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(email && { email }),
        }),
    });
export const deleteTeacher = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.TEACHER}?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


