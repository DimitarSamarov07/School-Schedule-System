import { ENDPOINTS } from "@/constants/endpoints";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Period } from "@/types/period";

const periodsEndpoint = (schoolId: number) =>
    `${ENDPOINTS.PERIOD.ALL}?schoolId=${schoolId}`;

export const getPeriodsForSchool = (schoolId: number): Promise<Period[]> =>
    apiRequest(periodsEndpoint(schoolId), { method: 'GET' });

export const createPeriod = async (
    schoolId: number,
    name: string,
    startTime: string,
    endTime: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.PERIOD.PRIMARY}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, startTime, endTime }) },
    );
    invalidateCache(periodsEndpoint(schoolId));
    return result;
};

export const updateTime = async (
    schoolId: number,
    id: number,
    name?: string,
    startTime?: string,
    endTime?: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.PERIOD.PRIMARY}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name      !== undefined && { name }),
                ...(startTime !== undefined && { startTime }),
                ...(endTime   !== undefined && { endTime }),
            }),
        },
    );
    invalidateCache(periodsEndpoint(schoolId));
    return result;
};

export const deletePeriod = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.PERIOD.PRIMARY}?id=${id}&schoolId=${schoolId}`,
        { method: 'DELETE' },
    );
    invalidateCache(periodsEndpoint(schoolId));
    return result;
};