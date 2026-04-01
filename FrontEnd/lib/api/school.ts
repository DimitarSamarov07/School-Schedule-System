import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {School} from "@/types/school";


export const getSchools: () => Promise<School[]> = () =>
    apiRequest(ENDPOINTS.SCHOOL+`/all`, {
        method: 'GET'
    });

export const createSchool = (name: string, address: string, workWeekConfig: number[])=>
    apiRequest(ENDPOINTS.SCHOOL, {
        method: 'POST',
        body: JSON.stringify({name, address,workWeekConfig})
    });
export const updateSchool = (schoolId: number,id: number, name?: string, address?: string, workWeekConfig?: number[]) =>
    apiRequest(ENDPOINTS.ROOM+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(address && { address }),
            ...(workWeekConfig && { workWeekConfig }),
        }),
    });
export const deleteSchool = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.SCHOOL}?id=${id}&&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


