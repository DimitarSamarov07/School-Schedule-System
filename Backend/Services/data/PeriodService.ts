import PeriodResponse from "../../response_models/PeriodResponse.ts";
import PeriodSql from "./queries/period.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import moment from "moment";
import RunningTime from "../../response_models/RunningTime.ts";


export class PeriodService {
    public static async getAllPeriodsForSchool(schoolId: number): Promise<PeriodResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async getPeriodByIdForSchool(id: number, schoolId: number) {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIOD_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async getRunningPeriodForSchool(schoolId: number): Promise<RunningTime | null> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            let resArr = rows.map((row: any) => new PeriodResponse(row));
            const now = moment();
            for (let i = 0; i < resArr.length; i++) {
                const start = moment(resArr[i].Start, 'HH:mm:ss');
                const end = moment(resArr[i].End, 'HH:mm:ss');
                if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                    return new RunningTime(resArr[i].Name, resArr[i].Start, resArr[i].End);
                } else {
                    return new RunningTime(
                        "Неучебно време"
                    );
                }
            }
            return null;
        });
    }

    public static async getNextRunningPeriodForSchool(schoolId: number): Promise<RunningTime | null> {
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


    public static async createPeriod(schoolId: number, name: string, startTime: string, endTime: string): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.INSERT_INTO_PERIODS, [schoolId, name, startTime, endTime]);
            return rows.map((row: any) => new PeriodResponse(row));
        });

    }

    public static async updatePeriod(id: number, schoolId: number, name: string | null, startTime: string | null, endTime: string | null): Promise<PeriodResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.UPDATE_PERIOD, [name, startTime, endTime, id, schoolId]);
            return new PeriodResponse(rows);

        });

    }

    public static async deletePeriod(id: number, schoolId: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(PeriodSql.DELETE_PERIOD, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}

