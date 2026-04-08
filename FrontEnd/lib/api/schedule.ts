import { ENDPOINTS } from '@/lib/constants';
import { apiRequest, invalidateCacheByPrefix } from '@/lib/api/client';
import Schedule from '@/types/schedule';
import type { ScheduleCreation } from '@/types/schedule';

// ─── SCHEDULE ──────────────────────────────────────────────────────────────────

export const getScheduleBetweenDates = (
    schoolId:  number,
    startDate: string,
    endDate:   string,
): Promise<Schedule[]> =>
    apiRequest(
        `${ENDPOINTS.SCHEDULE_BETWEEN_DATES}?schoolId=${schoolId}&startDate=${startDate}&endDate=${endDate}`,
        { method: 'GET' },
    );

const invalidateSchedule = (schoolId: number) =>
    invalidateCacheByPrefix(`${ENDPOINTS.SCHEDULE_BETWEEN_DATES}?schoolId=${schoolId}`);

export const bulkCreateSchedules = async (
    schoolId:  number,
    startDate: string,
    endDate:   string,
    dayOfWeek: number,
    schedules: ScheduleCreation[],
) => {
    const result = await apiRequest(`/schedule/bulk?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate, dayOfWeek, schedules }),
    });
    invalidateSchedule(schoolId);
    return result;
};

export const deleteSchedule = async (id: number, schoolId: number) => {
    const result = await apiRequest(`/schedule?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });
    invalidateSchedule(schoolId);
    return result;
};

// ─── ROOM ──────────────────────────────────────────────────────────────────────

const invalidateRoom = (schoolId: number) =>
    invalidateCacheByPrefix(`${ENDPOINTS.ROOM}?schoolId=${schoolId}`);

export const updateRoom = async (
    schoolId:  number,
    id:        number,
    name?:     string,
    floor?:    number,
    capacity?: number,
) => {
    const result = await apiRequest(`${ENDPOINTS.ROOM}?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name     !== undefined && { name }),
            ...(floor    !== undefined && { floor }),
            ...(capacity !== undefined && { capacity }),
        }),
    });
    invalidateRoom(schoolId);
    return result;
};

export const deleteRoom = async (id: number, schoolId: number) => {
    const result = await apiRequest(`${ENDPOINTS.ROOM}?id=${id}&schoolId=${schoolId}`, {
        method: 'DELETE',
    });
    invalidateRoom(schoolId);
    return result;
};