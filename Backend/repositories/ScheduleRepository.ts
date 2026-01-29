import Schedule from "../data_models/Schedule.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class ScheduleRepository {
    public static async getSchedulesByDateAndTimeAndSchool(schoolId: number, date: string, time: string): Promise<Schedule[]> {
        let schedulesToReturn: Schedule[] = [];
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_SCHEDULES_BY_DATE_AND_TIME_AND_SCHOOL, [schoolId, date, time]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }
}

