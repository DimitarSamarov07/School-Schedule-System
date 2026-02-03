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

export const createRoom = (name: string, floor: number)=>
    apiRequest(ENDPOINTS.ROOM, {
        method: 'POST',
        body: JSON.stringify({name, floor})
    });
export const updateRoom = (id: string | number, name?: string, floor?: number) =>
    apiRequest(ENDPOINTS.ROOM, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            ...(name && { name }),
            ...(floor && { floor }),
        }),
    });
export const deleteRoom = (id: string | number) =>
    apiRequest(`${ENDPOINTS.ROOM}?id=${id}`, {
        method: 'DELETE',
    });


