import RoomResponse from "../../response_models/RoomResponse.ts";
import RoomSql from "./queries/room.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";
import type {CreateRoomPayload, RoomIdPayload, UpdateRoomPayload} from "../../Validators/RoomValidators.ts";

export class RoomService {
    public static async getAllRoomsForSchool(data: SchoolIdPayload): Promise<RoomResponse[]> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(RoomSql.SELECT_ROOMS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new RoomResponse(row))
        });
    }

    public static async getRoomByIdForSchool(data: RoomIdPayload): Promise<RoomResponse> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(RoomSql.SELECT_ROOM_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new RoomResponse(row))[0]
        });
    }

    public static async createRoom(data: CreateRoomPayload): Promise<RoomResponse> {
        const {schoolId, name, floor, capacity} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(RoomSql.INSERT_ROOM, [schoolId, name, floor, capacity]);
            return rows.map((row: any) => new RoomResponse(row));
        });
    }

    public static async updateRoom(data: UpdateRoomPayload): Promise<RoomResponse> {
        const {name, floor, capacity, id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(RoomSql.UPDATE_ROOM, [name, floor, capacity, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(RoomSql.SELECT_ROOM_BY_ID, [id, schoolId]);
                return new RoomResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });
    }

    public static async deleteRoom(data: RoomIdPayload): Promise<boolean> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(RoomSql.DELETE_ROOM, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}
