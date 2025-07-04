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

    static getSchedulesByDate(): Schedule[] {
        // TODO: Implement

        return this.mockScheduleArr;
    }

    static async getSchedulesByClassIdForDate(classId: number, date: DateModel): Promise<Schedule[]> {
        let schedulesToReturn: Schedule[] = [];

        return new Promise((resolve, reject) => {

            this.db.serialize(() => {
                this.db.each(SqliteConstants.SELECT_SCHEDULES_BY_CLASS_ID_FOR_DATE, classId, date, (err, row: Schedule) => {
                    if (err) {
                        reject(err)
                        console.error(err);
                    }
                    schedulesToReturn.push(new Schedule(row.Class, row.Course, row.Times, row.Date));
                }, () => {
                    resolve(schedulesToReturn);
                })
            })
        });
    }

    static async getRunningTime(): Promise<RunningTime> {
        return new Promise((resolve, reject) => {
            this.db.all(SqliteConstants.SELECT_ALL_TIMES, [], (err, rows) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                for (const row of rows) {
                    // @ts-ignore
                    let parsedRow = new Time(row.id, row.Start, row.End);
                    if (this.isTimeBetween(new Date(), parsedRow.Start, parsedRow.End)) {
                        let rowTimeStart = parsedRow.Start.getHours() + ":" + parsedRow.Start.getMinutes();
                        let rowTimeEnd = parsedRow.End.getHours() + ":" + parsedRow.End.getMinutes();

                        return resolve(new RunningTime(parsedRow.Id, rowTimeStart, rowTimeEnd));
                    }
                }

                resolve(null);
            });
        });
    }


    //TODO: Finish the logic behind the schedule
    static getAllSchedulesForDateTime(dateAsEpoch: string): Schedule[] {

        let receivedArr = [];
        this.db.serialize(() => {
            //The .each method runs the given query for EACH row
            this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE, dateAsEpoch, (err, row) => {
                if (err) console.log(err);
                receivedArr.push(row);
                console.log(row);

            });
        });

        return this.mockScheduleArr;
    }

    static checkIsTimeBetweenDB() {

    }

    static isTimeBetween(x: Date, startTime: Date, endTime: Date): boolean {
        return startTime <= x && endTime >= x;

    }

    static getCurrentTime(): string {
        const now = new Date();

        const hours = now.getHours();
        const minutes = now.getMinutes();
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
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