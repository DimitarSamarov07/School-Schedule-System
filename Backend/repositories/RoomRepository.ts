import RoomResponse from "../response_models/RoomResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class RoomRepository {
    public static async getAllRoomsForSchool(schoolId: number): Promise<RoomResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_ROOMS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new RoomResponse(row))
        });
    }

    public static async createRoom(schoolId: number, name: string, floor: number, capacity: number): Promise<RoomResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.INSERT_ROOM, [schoolId, name, floor, capacity]);
            return rows.map((row: any) => new RoomResponse(row));
        });

    }

    public static async updateRoom(id: number, name: string | null, floor: number | null, capacity: number | null): Promise<RoomResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.UPDATE_ROOM, [id, name, floor, capacity]);
            return rows.map((row: any) => new RoomResponse(row));
        });

    }

    public static async deleteRoom(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.DELETE_ROOM, [id]);
            return rows.affectedRows > 0;
        });

    }
}
