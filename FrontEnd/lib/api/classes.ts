import { ENDPOINTS } from "@/constants/endpoints";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Class } from "@/types/class";

const classesEndpoint = (schoolId: number) =>
    `${ENDPOINTS.CLASS.ALL}?schoolId=${schoolId}`;

export const getClasses = (schoolId: number): Promise<Class[]> =>
    apiRequest(classesEndpoint(schoolId), { method: 'GET' });

export const createClass = async (
    schoolId: number,
    name: string,
    description: string,
    homeroomId: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS.PRIMARY}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, description, homeroomId }) },
    );
    invalidateCache(classesEndpoint(schoolId));
    return result;
};

export const updateClass = async (
    schoolId: number,
    id: number,
    name?: string,
    description?: string,
    homeroomId?: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS.PRIMARY}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name        !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(homeroomId  !== undefined && { homeroomId }),
            }),
        },
    );
    invalidateCache(classesEndpoint(schoolId));
    return result;
};

export const deleteGrade = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS.PRIMARY}?id=${id}&schoolId=${schoolId}`, // fixed: && → &
        { method: 'DELETE' },
    );
    invalidateCache(classesEndpoint(schoolId));
    return result;
};