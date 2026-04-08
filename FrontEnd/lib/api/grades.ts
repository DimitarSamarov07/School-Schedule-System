import { ENDPOINTS } from "@/lib/constants";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Grade } from "@/types/grade";

const gradesEndpoint = (schoolId: number) =>
    `${ENDPOINTS.CLASS}/all?schoolId=${schoolId}`;

export const getGrades = (schoolId: number): Promise<Grade[]> =>
    apiRequest(gradesEndpoint(schoolId), { method: 'GET' });

export const createGrade = async (
    schoolId: number,
    name: string,
    description: string,
    homeroomId: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, description, homeroomId }) },
    );
    invalidateCache(gradesEndpoint(schoolId));
    return result;
};

export const updateGrade = async (
    schoolId: number,
    id: number,
    name?: string,
    description?: string,
    homeroomId?: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS}?schoolId=${schoolId}`,
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
    invalidateCache(gradesEndpoint(schoolId));
    return result;
};

export const deleteGrade = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.CLASS}?id=${id}&schoolId=${schoolId}`, // fixed: && → &
        { method: 'DELETE' },
    );
    invalidateCache(gradesEndpoint(schoolId));
    return result;
};