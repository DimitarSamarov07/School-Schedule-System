import PeriodResponse from "../../response_models/PeriodResponse.ts";
import PeriodSql from "./queries/period.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import moment from "moment";
import RunningTime from "../../response_models/RunningTime.ts";
import HolidaySql from "./queries/holiday.sql.ts";
import HolidayResponse from "../../response_models/HolidayResponse.ts";


export class HolidayService {
    public static async getAllHolidaysForSchool(schoolId: number): Promise<PeriodResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(HolidaySql.SELECT_HOLIDAYS, [schoolId]);
            return rows.map((row: any) => new HolidayResponse(row));
        });
    }



    public static async createPeriod(schoolId: number, name: string, startTime: string, endTime: string): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.INSERT_INTO_PERIODS, [schoolId, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async updatePeriod(id: number, name: string | null, startTime: string | null, endTime: string | null): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.UPDATE_PERIOD, [id, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async deletePeriod(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.DELETE_PERIOD, [id]);
            return rows.affectedRows > 0;
        });

    }
}

