import Schedule from "../../data_models/Schedule.ts";
import ScheduleSql from "./queries/schedule.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import {PeriodService} from "./PeriodService.ts";
import moment from "moment";


export class ScheduleService {
    public static async createSchedule(schoolId: number, date: string, periodId: number, classId: number, teacherId: number, subjectId: number, roomId: number): Promise<Boolean> {
        return await connectionPoolFactory<Boolean>(async (conn) => {
            const result = await conn.query(ScheduleSql.INSERT_INTO_SCHEDULE, [schoolId, date, periodId, classId, teacherId, subjectId, roomId])
            return result.affectedRows > 0;
        });
    }

    public static async updateSchedule(id: number, schoolId: number, date: string | null,
                                       periodId: number | null, classId: number | null, teacherId: number | null,
                                       subjectId: number | null, roomId: number | null): Promise<Schedule> {
        return await connectionPoolFactory<Schedule>(async (conn) => {
            const result = await conn.query(ScheduleSql.UPDATE_SCHEDULE, [date, periodId, classId, teacherId, subjectId, roomId, id, schoolId])
            if (result.affectedRows > 0) {
                let updatedEntry = await conn.query(ScheduleSql.SELECT_SCHEDULE_BY_ID, [schoolId, id])
                return Schedule.convertFromDBModel(updatedEntry[0])
            }
            throw new Error("No rows affected")
        });
    }

    public static async deleteSchedule(id: number, schoolId: number): Promise<Boolean> {
        return await connectionPoolFactory<Boolean>(async (conn) => {
            const result = await conn.query(ScheduleSql.DELETE_FROM_SCHEDULES, [id, schoolId])
            return result.affectedRows > 0;
        });
    }

    public static async getSchoolScheduleById(id: number, schoolId: number): Promise<Schedule[]> {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULE_BY_ID, [schoolId, id]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row))[0];
        });
    }

    public static async getSchoolSchedulesByDateAndTime(schoolId: number, date: string, time: string): Promise<Schedule[]> {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, date, time]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getAllSchedulesForDateForSchool(schoolId: number, date: string): Promise<Schedule[]> {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_FOR_DATE, [schoolId, date]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getSchoolSchedulesForDateByClass(schoolId: number, classId: number, date: string) {
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_FOR_DATE_FOR_CLASS, [schoolId, date, classId]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getSchoolSchedulesForCurrentPeriod(schoolId: number): Promise<Schedule[]> {
        let nextPeriod = await PeriodService.getRunningPeriodForSchool(schoolId);
        if (nextPeriod === null) return [];

        let currentDate = moment().format("YYYY-MM-DD");
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, currentDate, nextPeriod.startTime])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    public static async getSchoolSchedulesForNextPeriod(schoolId: number): Promise<Schedule[]> {
        let nextPeriod = await PeriodService.getNextRunningPeriodForSchool(schoolId);
        if (nextPeriod === null) return [];

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

