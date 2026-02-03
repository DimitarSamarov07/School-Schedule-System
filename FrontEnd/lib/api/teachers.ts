import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Subject} from "@/types/subject";
import {Teacher} from "@/types/teacher";

//Teacher POST - body - firstName, lastName, email, subject
//ROOM PUT - body - id(required) name(optional), floor(optional)
//ROOM DELETE - query - id

export const getTeachers: (schoolId: number) => Promise<Teacher[]> = (schoolId: number) =>
    apiRequest(`/teacher/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createTeacher= (schoolId: number,name: string, email: string)=>
    apiRequest(ENDPOINTS.TEACHER+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, email})
    });
export const updateTeacher = (id: string | number, name?: string, email?: string) =>
    apiRequest(ENDPOINTS.TEACHER, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(email && { email }),
        }),
    });
export const deleteTeacher = (id: string | number) =>
    apiRequest(`${ENDPOINTS.TEACHER}?id=${id}`, {
        method: 'DELETE',
    });


