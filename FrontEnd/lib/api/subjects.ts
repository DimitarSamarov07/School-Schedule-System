import { ENDPOINTS } from "@/lib/constants";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Subject } from "@/types/subject";

const subjectsEndpoint = (schoolId: number) =>
    `${ENDPOINTS.SUBJECTS}/all?schoolId=${schoolId}`;

export const getSubjects = (schoolId: number): Promise<Subject[]> =>
    apiRequest(subjectsEndpoint(schoolId), { method: 'GET' });

export const createSubject = async (
    schoolId: number,
    name: string,
    description: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.SUBJECTS}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, description }) },
    );
    invalidateCache(subjectsEndpoint(schoolId));
    return result;
};

export const updateSubject = async (
    schoolId: number,
    id: number,
    name?: string,
    description?: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.SUBJECTS}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name        !== undefined && { name }),
                ...(description !== undefined && { description }),
            }),
        },
    );
    invalidateCache(subjectsEndpoint(schoolId));
    return result;
};

export const deleteSubject = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.SUBJECTS}?id=${id}&schoolId=${schoolId}`, // fixed: && → &
        { method: 'DELETE' },
    );
    invalidateCache(subjectsEndpoint(schoolId));
    return result;
};