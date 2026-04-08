import { ENDPOINTS } from "@/lib/constants";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Teacher } from "@/types/teacher";

const teachersEndpoint = (schoolId: number) =>
    `/teacher/all?schoolId=${schoolId}`;

export const getTeachers = (schoolId: number): Promise<Teacher[]> =>
    apiRequest(teachersEndpoint(schoolId), { method: 'GET' });

export const createTeacher = async (
    schoolId: number,
    name: string,
    email: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.TEACHER}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, email }) },
    );
    invalidateCache(teachersEndpoint(schoolId));
    return result;
};

export const updateTeacher = async (
    schoolId: number,
    id: number,
    name?: string,
    email?: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.TEACHER}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name  !== undefined && { name }),
                ...(email !== undefined && { email }),
            }),
        },
    );
    invalidateCache(teachersEndpoint(schoolId));
    return result;
};

export const deleteTeacher = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.TEACHER}?id=${id}&schoolId=${schoolId}`,
        { method: 'DELETE' },
    );
    invalidateCache(teachersEndpoint(schoolId));
    return result;
};