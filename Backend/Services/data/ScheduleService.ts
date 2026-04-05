import Schedule from "../../data_models/Schedule.ts";
import ScheduleSql from "./queries/schedule.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import {PeriodService} from "./PeriodService.ts";
import moment from "moment";
import {HolidayService} from "./HolidayService.ts";
import {SchoolService} from "./SchoolService.ts";

import type {
    BulkSchedulePayload,
    ClassDateScheduleQueryPayload,
    CreateSchedulePayload,
    DateAndTimeScheduleQueryPayload,
    DateQuerySchedulePayload,
    DateRangeScheduleQueryPayload,
    UpdateSchedulePayload
} from "../../Validators/ScheduleValidators.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";


export class ScheduleService {
    public static async createSchedule(data: CreateSchedulePayload): Promise<Boolean> {
        let {schoolId, date, periodId, classId, teacherId, subjectId, roomId} = data;
        return await connectionPoolFactory<Boolean>(async (conn) => {
            const result = await conn.query(ScheduleSql.INSERT_INTO_SCHEDULE, [schoolId, date, periodId, classId, teacherId, subjectId, roomId])
            return result.affectedRows > 0;
        });
    }

    public static async bulkCreateSchedules(data: BulkSchedulePayload) {
        let {schoolId, startDate, endDate, schedules} = data;
        await connectionPoolFactory(async (conn) => {
            for (const schedule of schedules) {
                let {periodId, classId, teacherId, subjectId, roomId} = schedule;
                const [check] = await conn.execute(ScheduleSql.CHECK_RELATIONS_GUARD,
                    [teacherId, schoolId,
                        roomId, schoolId,
                        subjectId, schoolId,
                        classId, schoolId,
                        periodId, schoolId,]);


                if (!check.teacher_ok || !check.room_ok || !check.subject_ok || !check.class_ok || !check.period_ok) {
                    throw new Error("Security Violation: One or more resources are unauthorized for this school.");
                }
            }
        })

        let workweekConfig = await SchoolService.getSchoolWorkWeekConfigById({schoolId});

        let holidaysList = await HolidayService.getAllHolidaysForSchool(schoolId);
        let holidayDates: string[] = [];

        holidaysList.forEach(h => {
            let start = moment(h.Start, "YYYY-MM-DD");
            let end = moment(h.End, "YYYY-MM-DD");
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
            await conn.batch(ScheduleSql.INSERT_BULK_INTO_SCHEDULE, valuesToInsert)
        })
    }

    public static async updateSchedule(data: UpdateSchedulePayload): Promise<Schedule> {
        let {date, periodId, classId, teacherId, subjectId, roomId, id, schoolId} = data;
        return await connectionPoolFactory<Schedule>(async (conn) => {
            const result = await conn.query(ScheduleSql.UPDATE_SCHEDULE,
                [date, periodId, classId, teacherId, subjectId, roomId, id, schoolId])
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

    public static async getSchoolSchedulesByDateAndTime(data: DateAndTimeScheduleQueryPayload): Promise<Schedule[]> {
        let {schoolId, date, time} = data;
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, date, time]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getAllSchedulesForDateForSchool(data: DateQuerySchedulePayload): Promise<Schedule[]> {
        let {schoolId, date} = data;
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_FOR_DATE, [schoolId, date]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getSchoolSchedulesForDateByClass(data: ClassDateScheduleQueryPayload) {
        let {schoolId, date, classId} = data;
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_FOR_DATE_FOR_CLASS, [schoolId, date, classId]);
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        });
    }

    public static async getSchoolSchedulesForCurrentPeriod(data: SchoolIdPayload): Promise<Schedule[]> {
        const {schoolId} = data;
        let nextPeriod = await PeriodService.getRunningPeriodForSchool(schoolId);
        if (nextPeriod === null) return [];

        let currentDate = moment().format("YYYY-MM-DD");
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, currentDate, nextPeriod.startTime])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    public static async getSchoolSchedulesForNextPeriod(data: SchoolIdPayload): Promise<Schedule[]> {
        const {schoolId} = data;
        let nextPeriod = await PeriodService.getNextRunningPeriodForSchool(schoolId);
        if (nextPeriod === null) return [];

        let currentDate = moment().format("YYYY-MM-DD");
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHEDULES_BY_DATE_AND_TIME_FOR_SCHOOL, [schoolId, currentDate, nextPeriod.startTime])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    public static async getAllSchedulesForSchoolBetweenDates(data: DateRangeScheduleQueryPayload) {
        let {schoolId, startDate, endDate} = data;
        return await connectionPoolFactory<Schedule[]>(async (conn) => {
            const rows = await conn.query(ScheduleSql.SELECT_SCHOOL_SCHEDULES_FOR_DATE_INTERVAL, [schoolId, startDate, endDate])
            return rows.map((row: any) => Schedule.convertFromDBModel(row));
        })
    }

    private static async getValidSchoolDates(startDate: string, endDate: string, workWeek = [1, 2, 3, 4, 5], holidays: string[] = []) {
        const dates: string[] = [];
        let current = moment(startDate, "YYYY-MM-DD").startOf('day');
        const end = moment(endDate, "YYYY-MM-DD").startOf('day');

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

