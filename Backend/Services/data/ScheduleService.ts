import Schedule from "../../data_models/Schedule.ts";
import ScheduleSql from "./queries/schedule.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";


//TODO: Get schedules by date and time but we need the schedules for the next period
//TODO: Get all of the schedules for the week for a school
//TODO: Get schedules by schoolId but for the current period

export class ScheduleService {
    public static async getSchoolSchedulesByDateAndTime(schoolId: number, date: string, time: string): Promise<Schedule[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_AND_SCHOOL, [schoolId, date, time]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }
}

