import DateModel from "./data_models/DateModel.js";
import Schedule from "./data_models/Schedule.js";
import Course from "./data_models/Course.js";
import Teacher from "./data_models/Teacher.js";
import Room from "./data_models/Room.js";
import Class from "./data_models/Class.js";
import type {Database} from "sqlite3";
import sqlite3 from "sqlite3";
import SqliteConstants from "./sqlite_constants.js";
import Bell from "./data_models/Bell.js";

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
        SqliteMaster.mockScheduleArr = [new Schedule(testCourse, testClass, testTeacher, testDate)]
    }

    static initializeConnection(): void {
        const sqlite = sqlite3.verbose();
        this.db = new sqlite.Database(this.DATABASE_PATH);
    }

    static disconnectFromDB(): void {
        this.db.close()
    }

    static getScheduleByClassIdForDate(classId: number, date: DateModel): Schedule {
        // TODO: Implement

        return this.mockScheduleArr[0];
    }
    static async getCurrentHour(): Promise<string> {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);


        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, Start, End FROM Times', [], (err, rows: Object[]) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                for (const row of rows) {
                    // @ts-ignore
                    if (this.isTimeBetween(currentTime, row.Start, row.End)) {

                        let result = "";
                        // @ts-ignore
                        switch (row.id) {
                            case 1:
                                // @ts-ignore
                                result ="1-ви час " + row.Start + "-"  + row.End;
                                break;
                            case 2:
                                // @ts-ignore
                                result = "2-ри час" + row.Start + "-"  + row.End;
                                break;
                            case 3:
                                // @ts-ignore
                                result = "3-ти час" + row.Start + "-"  + row.End;
                                break;
                            case 4:
                                // @ts-ignore
                                result = "4-ти час" + row.Start + "-"  + row.End;
                                break;
                            case 5:
                                // @ts-ignore
                                result = "5-ти час" + row.Start + "-"  + row.End;
                                break;
                            case 6:
                                // @ts-ignore
                                result = "6-ти час" + row.Start + "-"  + row.End;
                                break;
                            case 7:
                                // @ts-ignore
                                result = "7-ми час" + row.Start + "-"  + row.End;
                                break;
                            case 8:
                                // @ts-ignore
                                result = "8-ми час" + row.Start + "-"  + row.End;
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

        if (!this.isTimeBetween(this.getCurrentTime(), "07:00", "15:00")) {
            console.log("")
        }


        return this.mockScheduleArr;
    }

    static checkIsTimeBetweenDB() {

    }

    static isTimeBetween(x: string, startTime: string, endTime: string) {
        const toMinutes = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const xMin = toMinutes(x);
        const startMin = toMinutes(startTime);
        const endMin = toMinutes(endTime);

        // Handles intervals that don’t cross midnight
        if (startMin <= endMin) {
            return xMin >= startMin && xMin <= endMin;
        }
        // Handles intervals that cross midnight (e.g. 23:00 to 01:00)
        return xMin >= startMin || xMin <= endMin;
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