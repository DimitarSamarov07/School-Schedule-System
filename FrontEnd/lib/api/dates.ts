import { ENDPOINTS } from "@/lib/constants";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Holiday } from "@/types/holiday";

const holidayEndpoint = (schoolId: number) =>
    `${ENDPOINTS.HOLIDAY}/all?schoolId=${schoolId}`;

export const getHoliday = (schoolId: number): Promise<Holiday[]> =>
    apiRequest(holidayEndpoint(schoolId), { method: 'GET' });

export const createDate = async (
    schoolId: number,
    name: string,
    startDate: string,
    endDate: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.HOLIDAY}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, startDate, endDate }) },
    );
    invalidateCache(holidayEndpoint(schoolId));
    return result;
};

export const updateDate = async (
    schoolId: number,
    id: number,
    name?: string,
    start?: string,
    end?: string,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.HOLIDAY}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name && { name }),
                ...(start && { start }),
                ...(end && { end }),
            }),
        },
    );
    invalidateCache(holidayEndpoint(schoolId));
    return result;
};

export const deleteDate = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.HOLIDAY}?id=${id}&schoolId=${schoolId}`,
        { method: 'DELETE' },
    );
    invalidateCache(holidayEndpoint(schoolId));
    return result;
};