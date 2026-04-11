import { ENDPOINTS } from "@/constants/endpoints";
import { apiRequest, invalidateCache } from "@/lib/api/client";
import { Room } from "@/types/room";

const roomsEndpoint = (schoolId: number) =>
    `${ENDPOINTS.ROOM.ALL}?schoolId=${schoolId}`;

export const getRooms = (schoolId: number): Promise<Room[]> =>
    apiRequest(roomsEndpoint(schoolId), { method: 'GET' });

export const createRoom = async (
    schoolId: number,
    name: string,
    floor: number,
    capacity: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.ROOM.PRIMARY}?schoolId=${schoolId}`,
        { method: 'POST', body: JSON.stringify({ name, floor, capacity }) },
    );
    invalidateCache(roomsEndpoint(schoolId));
    return result;
};

export const updateRoom = async (
    schoolId: number,
    id: number,
    name?: string,
    floor?: number,
    capacity?: number,
) => {
    const result = await apiRequest(
        `${ENDPOINTS.ROOM.PRIMARY}?schoolId=${schoolId}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                id,
                ...(name     !== undefined && { name }),
                ...(floor    !== undefined && { floor }),
                ...(capacity !== undefined && { capacity }),
            }),
        },
    );
    invalidateCache(roomsEndpoint(schoolId));
    return result;
};

export const deleteRoom = async (id: number, schoolId: number) => {
    const result = await apiRequest(
        `${ENDPOINTS.ROOM.PRIMARY}?id=${id}&schoolId=${schoolId}`, // fixed: && → &
        { method: 'DELETE' },
    );
    invalidateCache(roomsEndpoint(schoolId));
    return result;
};