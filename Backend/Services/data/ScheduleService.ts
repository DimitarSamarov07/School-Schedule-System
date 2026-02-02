import Schedule from "../../data_models/Schedule.ts";
import ScheduleSql from "./queries/schedule.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import {PeriodService} from "./PeriodService.ts";
import moment from "moment";


export class ScheduleService {
    public static async getSchoolSchedulesByDateAndTime(schoolId: number, date: string, time: string): Promise<Schedule[]> {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, date, time]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getSchoolSchedulesForCurrentPeriod(schoolId: number): Promise<Schedule[]> {
        let nextPeriod = await PeriodService.getRunningPeriodForSchool(schoolId);
        let currentDate = moment().format("YYYY-MM-DD");
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, currentDate, nextPeriod.startTime])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    public static async getSchoolSchedulesForNextPeriod(schoolId: number): Promise<Schedule[]> {
        let nextPeriod = await PeriodService.getNextRunningPeriodForSchool(schoolId);
        let currentDate = moment().format("YYYY-MM-DD");
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, currentDate, nextPeriod.startTime])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    public static async getAllSchedulesForSchoolBetweenDates(schoolId: number, startDate: string, endDate: string) {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHOOL_SCHEDULES_FOR_DATE_INTERVAL, [schoolId, startDate, endDate])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }
}

