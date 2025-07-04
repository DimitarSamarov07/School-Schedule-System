import DateModel from "./data_models/DateModel.js";
import Schedule from "./data_models/Schedule.js";
import Course from "./data_models/Course.js";
import Teacher from "./data_models/Teacher.js";
import Room from "./data_models/Room.js";
import Class from "./data_models/Class.js";
import type {Database} from "sqlite3"
import sqlite3 from "sqlite3";
import Bell from "./data_models/Bell.js";
import Time from "./data_models/Time.js";
import SqliteConstants from "./sqlite_constants.js";
import RunningTime from "./response_models/RunningTime.js";
import moment from "moment";

class SqliteMaster {
    static mockScheduleArr: Schedule[];
    static readonly DATABASE_PATH: string = "./dev.db";
    static db: Database;
    static delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    constructor() {
        // Initialize mock data
        let testRoom = new Room(1, "test", 1)
        let testClass = new Class(1, "test", "test")
        let testTeacher = new Teacher(1, "test", "test")
        let testCourse = new Course(1, "test", testTeacher, testRoom)
        let testDate = new DateModel(1, new Date(), false)
        let testTime = new Time(1, '223', '322');
        SqliteMaster.mockScheduleArr = [new Schedule(testClass, testCourse, testTime, testDate)]
    }

    static initializeConnection(): void {
        const sqlite = sqlite3.verbose();
        this.db = new sqlite.Database(this.DATABASE_PATH);
    }

    static disconnectFromDB(): void {
        this.db.close()
    }


    static async getSchedulesByClassIdForDate(classId: number, date: string): Promise<Schedule[]> {
        let schedulesToReturn: Schedule[] = [];
        return new Promise((resolve, reject) => {
            this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE_AND_CLASS_ID, [date, classId], (err, row: any) => {
                if (err) {
                    reject(err)
                    console.error(err);
                }
                schedulesToReturn.push(Schedule.convertFromDBModel(row));
            }, () => {
                resolve(schedulesToReturn);
            })
        });
    }

    static async getRunningTime(): Promise<RunningTime> {
        let isInBreak;
        return new Promise((resolve, reject) => {
            this.db.all(SqliteConstants.SELECT_ALL_TIMES, [], (err, rows: any) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                for (const row of rows) {
                    let parsedRow = new Time(row.id, row.Start, row.End);
                    const now = moment();
                    const start = moment(parsedRow.Start, 'HH:mm');
                    const end = moment(parsedRow.End, 'HH:mm');
                    if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                        return resolve(new RunningTime(parsedRow.Id, parsedRow.Start, parsedRow.End));
                    }
                }
                isInBreak = null;
            });
            if (isInBreak == null) {
                this.db.all(SqliteConstants.SELECT_BREAKS, [], (err, rows: any) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    for (const row of rows) {
                        let parsedRow = new Time(row.id, row.Start, row.End);
                        const now = moment();
                        const start = moment(parsedRow.Start, 'HH:mm');
                        const end = moment(parsedRow.End, 'HH:mm');
                        if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                            return resolve(new RunningTime(-1, parsedRow.Start, parsedRow.End));
                        }
                    }
                    isInBreak = true;

                });
            }
        });
    }


    //TODO: Finish the logic behind the schedule
    static getAllSchedulesForDate(date: string): Promise<Schedule[]> {
        let receivedArr = [];

        return new Promise((resolve, reject) => {
            //The .each method runs the given query for EACH row
            this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE, date, (err, row) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                let schedule = Schedule.convertFromDBModel(row);
                receivedArr.push(schedule);
            }, () => {
                resolve(receivedArr);
            });
        });
    }
    static getAllSchedulesForDateTime(date: string, time:string): Promise<Schedule[]> {
        let receivedArr = [];

        return new Promise((resolve, reject) => {
            //The .each method runs the given query for EACH row
            this.db.each(SqliteConstants.SELECT_SCHEDULES_BY_DATE_AND_TIME, [date, time], (err, row) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                let schedule = Schedule.convertFromDBModel(row);
                receivedArr.push(schedule);
            }, () => {
                resolve(receivedArr);
            });
        });
    }


    static async getBellPathByName(bellName: string): Promise<Bell> {
        let bellToReturn: Bell = null;
        this.db.serialize(() => {
            this.db.each(SqliteConstants.SELECT_BELL_BY_NAME, bellName, (err, row: Bell) => {
                if (err) throw err;
                bellToReturn = new Bell(row.Id, row.Name, row.SoundPath);
            })
        })

        while (bellToReturn == null) {
            await this.delay(5)
        }
        return bellToReturn;
    }

}
export default SqliteMaster;