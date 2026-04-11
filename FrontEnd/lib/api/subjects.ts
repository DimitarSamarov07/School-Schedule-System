import { ENDPOINTS } from "@/constants/endpoints";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Subject } from "@/types/subject";

const subjectsEndpoint = (schoolId: number) =>
    `${ENDPOINTS.SUBJECT.ALL}?schoolId=${schoolId}`;

export const getSubjects = (schoolId: number): Promise<Subject[]> =>
    apiRequest(subjectsEndpoint(schoolId), { method: 'GET' });

export const createSubject = async (
    schoolId: number,
    name: string,
    description: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.SUBJECT.PRIMARY}?schoolId=${schoolId}`,
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
        `${ENDPOINTS.SUBJECT.PRIMARY}?schoolId=${schoolId}`,
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
        `${ENDPOINTS.SUBJECT.PRIMARY}?id=${id}&schoolId=${schoolId}`,
        { method: 'DELETE' },
    );
    invalidateCache(subjectsEndpoint(schoolId));
    return result;
};