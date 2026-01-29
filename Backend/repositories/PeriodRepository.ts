import PeriodResponse from "../response_models/PeriodResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";


export class PeriodRepository {
    public static async getAllPeriodsForSchool(schoolId: number): Promise<PeriodResponse[]> {
        return await connectionPoolFactory( async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }}

