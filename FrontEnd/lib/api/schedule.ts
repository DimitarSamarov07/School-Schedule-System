import { ENDPOINTS } from '@/constants/endpoints';
import { apiRequest, invalidateCacheByPrefix } from '@/lib/api/client';
import Schedule from '@/types/schedule';
import type { ScheduleCreation } from '@/types/schedule';

export const getScheduleBetweenDates = (
    schoolId:  number,
    startDate: string,
    endDate:   string,
): Promise<Schedule[]> =>
    apiRequest(
        `${ENDPOINTS.SCHEDULE.BETWEEN_DATES}?schoolId=${schoolId}&startDate=${startDate}&endDate=${endDate}`,
        { method: 'GET' },
    );

const invalidateSchedule = (schoolId: number) =>
    invalidateCacheByPrefix(`${ENDPOINTS.SCHEDULE.BETWEEN_DATES}?schoolId=${schoolId}`);

export const bulkCreateSchedules = async (
    schoolId:  number,
    startDate: string,
    endDate:   string,
    dayOfWeek: number,
    schedules: ScheduleCreation[],
) => {
    const result = await apiRequest(`${ENDPOINTS.SCHEDULE.BULK}?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate, dayOfWeek, schedules }),
    });
    invalidateSchedule(schoolId);
    return result;
};

export const deleteSchedule = async (id: number, schoolId: number) => {
    const result = await apiRequest(`${ENDPOINTS.SCHEDULE.PRIMARY}?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });
    invalidateSchedule(schoolId);
    return result;
};


