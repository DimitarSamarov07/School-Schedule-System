import PeriodResponse from "../response_models/PeriodResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";


export class PeriodRepository {
    public static async getAllPeriodsForSchool(schoolId: number): Promise<PeriodResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async createPeriod(schoolId: number, name: string, startTime: string, endTime: string): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.INSERT_INTO_PERIODS, [schoolId, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async updatePeriod(id: number, name: string | null, startTime: string | null, endTime: string | null): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.UPDATE_PERIOD, [id, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async deletePeriod(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.DELETE_PERIOD, [id]);
            return rows.affectedRows > 0;
        });

    }
}

