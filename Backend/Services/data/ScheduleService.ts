import Schedule from "../../data_models/Schedule.ts";
import ScheduleSql from "./queries/schedule.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import {PeriodService} from "./PeriodService.ts";
import moment from "moment";
import type {ScheduleCreation} from "../../DTO/ScheduleCreation.ts";
import {HolidayService} from "./HolidayService.ts";
import {SchoolService} from "./SchoolService.ts";


export class ScheduleService {
    public static async createSchedule(schoolId: number, date: string, periodId: number, classId: number, teacherId: number, subjectId: number, roomId: number): Promise<Boolean> {
        return await connectionPoolFactory<Boolean>(async (conn) => {
            const result = await conn.query(ScheduleSql.INSERT_INTO_SCHEDULE, [schoolId, date, periodId, classId, teacherId, subjectId, roomId])
            return result.affectedRows > 0;
        });
    }

    public static async bulkCreateSchedules(schoolId: number, startDate: string, endDate: string, schedules: ScheduleCreation[]) {

        await connectionPoolFactory(async (conn) => {
            for (const schedule of schedules) {
                let periodId = schedule.periodId;
                let classId = schedule.classId;
                let teacherId = schedule.teacherId;
                let subjectId = schedule.subjectId;
                let roomId = schedule.roomId;
                const [check] = await conn.execute(ScheduleSql.CHECK_RELATIONS_GUARD,
                    [teacherId, schoolId,
                        roomId, schoolId,
                        subjectId, schoolId,
                        classId, schoolId,
                        periodId, schoolId,]);

                let status = check[0];

                if (!status.teacher_ok || !status.room_ok || !status.subject_ok || !status.class_ok || !status.period_ok) {
                    throw new Error("Security Violation: One or more resources are unauthorized for this school.");
                }
            }
        })

        let workweekConfigJson = await SchoolService.getSchoolWorkWeekConfigById(schoolId);
        let workweekConfig = JSON.parse(workweekConfigJson);

        let holidaysList = await HolidayService.getAllHolidaysForSchool(schoolId);
        let holidayDates: string[] = [];

        holidaysList.forEach(h => {
            let start = moment(h.Start);
            let end = moment(h.End);
            while (start.isSameOrBefore(end)) {
                holidayDates.push(start.format('YYYY-MM-DD'));
                start.add(1, 'day');
            }
        });

        let schoolDates = await this.getValidSchoolDates(startDate, endDate, workweekConfig, holidayDates)

        let valuesToInsert: any[] = [];

        for (const schedule of schedules) {
            for (const date of schoolDates) {
                valuesToInsert.push([schoolId, date, schedule.periodId,
                    schedule.classId, schedule.teacherId,
                    schedule.subjectId, schedule.roomId]);
            }
        }

        await connectionPoolFactory(async (conn) => {
            await conn.query(ScheduleSql.INSERT_BULK_INTO_SCHEDULE, [valuesToInsert])
        })
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

    private static async getValidSchoolDates(startDate: string, endDate: string, workWeek = [1, 2, 3, 4, 5], holidays: string[] = []) {
        const dates: string[] = [];
        let current = moment(startDate).startOf('day');
        const end = moment(endDate).startOf('day');

        // Convert holiday strings to a Set for fast lookup
        const holidaySet = new Set(holidays.map(d => moment(d).format('YYYY-MM-DD')));

        while (current.isSameOrBefore(end)) {
            const dateStr = current.format('YYYY-MM-DD');
            const dayOfWeek = current.isoWeekday(); // 1 (Mon) to 7 (Sun)

            // 1. Check if the day is in the school's work week
            const isWorkDay = workWeek.includes(dayOfWeek);

            // 2. Check if the date is NOT in the holiday list
            const isNotHoliday = !holidaySet.has(dateStr);

            if (isWorkDay && isNotHoliday) {
                dates.push(dateStr);
            }

            current.add(1, 'days');
        }

        return dates;
    }
}

