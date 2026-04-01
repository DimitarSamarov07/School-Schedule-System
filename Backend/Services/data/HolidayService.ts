import {connectionPoolFactory} from "../db_service.ts";
import HolidaySql from "./queries/holiday.sql.ts";
import HolidayResponse from "../../response_models/HolidayResponse.ts";
import ClassResponse from "../../response_models/ClassResponse.ts";


export class HolidayService {
    public static async getAllHolidaysForSchool(schoolId: number): Promise<HolidayResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(HolidaySql.SELECT_HOLIDAYS, [schoolId]);
            return rows.map((row: any) => new HolidayResponse(row));
        });
    }

    public static async getHolidayById(id: number, schoolId: number): Promise<HolidayResponse> {
        return await connectionPoolFactory(async (conn): Promise<HolidayResponse> => {
            const rows = await conn.query(HolidaySql.SELECT_HOLIDAY_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new HolidayResponse(row))[0];
        });
    }

    public static async createHolidayForSchool(schoolId: number, name: string, startDate: string, endDate: string): Promise<Boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(HolidaySql.INSERT_HOLIDAY, [schoolId, name, startDate, endDate]);
            return rows.affectedRows > 0;
        });
    }

    public static async updateHolidayForSchool(id: number, schoolId: number, name: string | null, startDate: string | null, endDate: string | null): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(HolidaySql.UPDATE_HOLIDAY, [name, startDate, endDate, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(HolidaySql.SELECT_HOLIDAY_BY_ID, [id, schoolId])
                return new ClassResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected")
        });
    }

    public static async deleteHolidayForSchool(id: number, schoolId: number): Promise<Boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(HolidaySql.DELETE_HOLIDAY, [id, schoolId]);
            return rows.affectedRows > 0;
        });
    }
}

