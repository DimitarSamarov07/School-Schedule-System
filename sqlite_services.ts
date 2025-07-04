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
        let testTime = new Time(1, '223','322') ;
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

    static async getScheduleByClassIdForDate(classId: number, date: DateModel): Promise<Schedule> {

        let scheduleToReturn: Schedule = null;
        this.db.serialize(() => {
            this.db.each(SqliteConstants.SELECT_SCHEDULES_BY_CLASS_ID_FOR_DATE, classId,date , (err, row: Schedule) => {
                if (err) throw err;
                scheduleToReturn = new Schedule(row.Class,row.Course,row.Times,row.Date);
            })
        })

        while (scheduleToReturn == null){
            await this.delay(5)
        }
        return scheduleToReturn;
    }
    static async getCurrentHour(): Promise<string> {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);
        let timeArr = [];

        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, Start, End FROM Times', [], (err, rows) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                for (const row of rows) {
                    let parsedRow = new Time(row.Id, row.Start, row.End);
                    timeArr.push(parsedRow)
                    console.log(this.isTimeBetween(new Date(), parsedRow.Start, parsedRow.End))
                    console.log(new Date())
                    console.log(parsedRow.Start)
                    console.log(parsedRow.End)
                    if (this.isTimeBetween(new Date(), parsedRow.Start, parsedRow.End)) {
                        let result = "";
                        switch (parsedRow.Id) {
                            case 1:
                                result ="1-ви час " + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 2:
                                result = "2-ри час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 3:
                                result = "3-ти час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 4:
                                result = "4-ти час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 5:
                                result = "5-ти час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 6:
                                result = "6-ти час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 7:
                                result = "7-ми час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            case 8:
                                result = "8-ми час" + parsedRow.Start + "-"  + parsedRow.End;
                                break;
                            default:
                                result = "Непознат час";
                        }

                        return resolve(result);
                    }
                }

                resolve("Извън учебно време");
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
        // TODO: display ads

        if (!this.isTimeBetween(new Date(), "07:00", "15:00")) {
            console.log("")
        }


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

        while (bellToReturn == null){
            await this.delay(5)
        }
        return bellToReturn;
    }

}

export default SqliteMaster;