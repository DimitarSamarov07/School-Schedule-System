import PeriodResponse from "../../response_models/PeriodResponse.ts";
import PeriodSql from "./queries/period.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import moment from "moment";
import RunningTime from "../../response_models/RunningTime.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";
import type {CreatePeriodPayload, PeriodIdPayload, UpdatePeriodPayload} from "../../Validators/PeriodValidators.ts";


export class PeriodService {
    public static async getAllPeriodsForSchool(data: SchoolIdPayload): Promise<PeriodResponse[]> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async getPeriodByIdForSchool(data: PeriodIdPayload): Promise<PeriodResponse> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIOD_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async getRunningPeriodForSchool(data: SchoolIdPayload): Promise<RunningTime | null> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            let resArr = rows.map((row: any) => new PeriodResponse(row));
            const now = moment();
            let currentTime: RunningTime | null = null;
            for (let i = 0; i < resArr.length; i++) {
                const start = moment(resArr[i].Start, 'HH:mm:ss');
                const end = moment(resArr[i].End, 'HH:mm:ss');
                if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                    currentTime = new RunningTime(resArr[i].Name, resArr[i].Start, resArr[i].End);
                    break;
                }
            }
            return currentTime || new RunningTime("Неучебно време");
        });
    }

    public static async getNextRunningPeriodForSchool(data: SchoolIdPayload): Promise<RunningTime | null> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIODS_BY_SCHOOL, [schoolId]);

            let resArr = rows
                .map((row: any) => new PeriodResponse(row))
                .sort((a, b) => moment(a.Start, 'HH:mm:ss').diff(moment(b.Start, 'HH:mm:ss')));

            const now = moment();

            for (let i = 0; i < resArr.length; i++) {
                const currentPeriodEnd = moment(resArr[i].End, 'HH:mm:ss');
                if (now.isBefore(currentPeriodEnd)) {
                    let nextRow = resArr[i + 1];
                    if (resArr[i + 1]) {
                        return new RunningTime(
                            nextRow.Name,
                            nextRow.Start,
                            nextRow.End
                        );
                    }
                }
            }

            if (resArr.length > 0) {
                return new RunningTime(
                    "Неучебно време"
                );
            }

            return null;
        });
    }


    public static async createPeriod(data: CreatePeriodPayload): Promise<PeriodResponse> {
        const {schoolId, name, startTime, endTime} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.INSERT_INTO_PERIODS, [schoolId, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async updatePeriod(data: UpdatePeriodPayload): Promise<PeriodResponse> {
        const {schoolId, name, startTime, endTime, id} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.UPDATE_PERIOD, [name, startTime, endTime, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(PeriodSql.SELECT_PERIOD_BY_ID, [id, schoolId]);
                return new PeriodResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });

    }

    public static async deletePeriod(data: PeriodIdPayload): Promise<boolean> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.DELETE_PERIOD, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}

