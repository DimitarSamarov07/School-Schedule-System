import RoomResponse from "../response_models/RoomResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class RoomRepository {
    public static async getAllRoomsForSchool(schoolId: number): Promise<RoomResponse[]> {
        return await connectionPoolFactory( async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_ROOMS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new RoomResponse(row))
        });
    }
}
