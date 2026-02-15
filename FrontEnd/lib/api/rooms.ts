import {ENDPOINTS} from "@/lib/constants";
import {apiRequest} from "@/lib/api/client";
import {Room} from "@/types/room";

//ROOM POST - body - name, floor
//ROOM PUT - body - id(required) name(optional), floor(optional)
//ROOM DELETE - query - id

export const getRooms: (schoolId: number) => Promise<Room[]> = (schoolId: number) =>
    apiRequest(ENDPOINTS.ROOM+`/all?schoolId=${schoolId}`, {
        method: 'GET'
    });

export const createRoom = (schoolId: number,name: string, floor: number, capacity: number)=>
    apiRequest(ENDPOINTS.ROOM+`?schoolId=${schoolId}`, {
        method: 'POST',
        body: JSON.stringify({name, floor,capacity})
    });
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


