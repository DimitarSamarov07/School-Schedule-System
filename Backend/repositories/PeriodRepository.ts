import PeriodResponse from "../response_models/PeriodResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";
import moment from "moment";
import RunningTime from "../response_models/RunningTime.ts";


export class PeriodRepository {
    public static async getAllPeriodsForSchool(schoolId: number): Promise<PeriodResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new PeriodResponse(row));
        });
    }

    public static async getRunningPeriodForSchool(schoolId: number): Promise<RunningTime> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_PERIODS_BY_SCHOOL, [schoolId]);
            let resArr = rows.map((row: any) => new PeriodResponse(row));
            const now = moment();
            for (let i = 0; i < resArr.length; i++) {
                const start = moment(resArr[i].Start, 'HH:mm:ss');
                const end = moment(resArr[i].End, 'HH:mm:ss');
                if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                    return new RunningTime(resArr[i].Name, resArr[i].Start, resArr[i].End);
                }
                else{
                    return new RunningTime(
                        "Неучебно време",null,null
                    );
                }
            }
        });
    }

    public static async getNextRunningPeriodForSchool(schoolId: number): Promise<RunningTime | null> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_PERIODS_BY_SCHOOL, [schoolId]);

            let resArr = rows
                .map((row: any) => new PeriodResponse(row))
                .sort((a, b) => moment(a.Start, 'HH:mm:ss').diff(moment(b.Start, 'HH:mm:ss')));

            const now = moment();

            for (let i = 0; i < resArr.length; i++) {
                const currentPeriodEnd = moment(resArr[i].End, 'HH:mm:ss');
                if (now.isBefore(currentPeriodEnd)) {
                    let nextRow = resArr[i+1];
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
                    "Неучебно време",
                    null,
                    null
                );
            }

            return null;
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

