import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Room} from "@/types/room";
import Schedule from "@/types/schedule";
import type { ScheduleEntry, ScheduleCreation } from '@/types/schedule';
//ROOM POST - body - name, floor
//ROOM PUT - body - id(required) name(optional), floor(optional)
//ROOM DELETE - query - id

export const getScheduleBetweenDates: (schoolId: number, startDate: string, endDate: string) => Promise<Schedule[]> = (schoolId: number, startDate: string, endDate:string) =>
    apiRequest(ENDPOINTS.SCHEDULE_BETWEEN_DATES+`?schoolId=${schoolId}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET'
    });


export async function bulkCreateSchedules(
    schoolId: number,
    startDate: string,
    endDate: string,
    payload: ScheduleCreation[]
): Promise<void> {
    const res = await apiRequest(`/schedule/bulk?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({
            startDate,
            endDate,
            schedules: [{
                periodId:  payload.per,
                classId:   selClassId,
                subjectId: selSubjectId,
                teacherId: selTeacherId,
                roomId:    selRoomId,
            }],
        }),;
    if (!res.ok) throw new Error(await res.text());
}

export async function deleteSchedule(id: number): Promise<void> {
    const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
}
export const updateRoom = (schoolId: number,id: number, name?: string, floor?: number, capacity?: number) =>
    apiRequest(ENDPOINTS.ROOM+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(floor && { floor }),
            ...(capacity && { capacity }),
        }),
    });
export const deleteRoom = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.ROOM}?id=${id}&&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


