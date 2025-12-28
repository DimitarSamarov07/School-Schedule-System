import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Subject} from "@/types/subject";

//Teacher POST - body - firstName, lastName, email, subject
//ROOM PUT - body - id(required) name(optional), floor(optional)
//ROOM DELETE - query - id

export const getTeachers = () =>
    apiRequest("/teacher", {
        method: 'GET'
    });

export const createTeacher= (firstName: string, lastName: string, email: string, subject: Subject)=>
    apiRequest(ENDPOINTS.TEACHER, {
        method: 'POST',
        body: JSON.stringify({firstName, lastName, email, subject})
    });
export const updateTeacher = (id: string | number, firstName?: string, lastName?: string, email?: string, subject?: Subject) =>
    apiRequest(ENDPOINTS.TEACHER, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(subject && { subject }),
        }),
    });
export const deleteTeacher = (id: string | number) =>
    apiRequest(`${ENDPOINTS.TEACHER}?id=${id}`, {
        method: 'DELETE',
    });


