import {ENDPOINTS} from "@/constants/endpoints";
import {apiRequest} from "@/lib/api/client";
import {School} from "@/types/school";


export const getSchools: () => Promise<School[]> = () =>
    apiRequest(ENDPOINTS.SCHOOL.ALL, {
        method: 'GET'
    });

export const createSchool = (name: string, address: string, workWeekConfig: number[])=>
    apiRequest(ENDPOINTS.SCHOOL.PRIMARY, {
        method: 'POST',
        body: JSON.stringify({name, address,workWeekConfig})
    });
export const updateSchool = (schoolId: number,id: number, name?: string, address?: string, workWeekConfig?: number[]) =>
    apiRequest(ENDPOINTS.SCHOOL.PRIMARY+`?schoolId=${schoolId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(address && { address }),
            ...(workWeekConfig && { workWeekConfig }),
        }),
    });
export const deleteSchool = (id: number, schoolId: number) =>
    apiRequest(`${ENDPOINTS.SCHOOL.PRIMARY}?id=${id}&&schoolId=${schoolId}`, {
        method: 'DELETE',
    });


