import DateModel from "./data_models/DateModel.js";
import Schedule from "./data_models/Schedule.js";
import Course from "./data_models/Course.js";
import Teacher from "./data_models/Teacher.js";
import Room from "./data_models/Room.js";
import Class from "./data_models/Class.js";
import type {Database} from "sqlite3"
import Sqlite_consts from "./sqlite_consts.js";
import sqlite3 from "sqlite3";
import  Bell from "./data_models/Bell.js";
import bell from "./data_models/Bell.js";

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

    static getSchedulesByDate(): Schedule[] {
        // TODO: Implement

        return this.mockScheduleArr;
    }

    static getScheduleByClassIdForDate(classId: number, date: DateModel): Schedule {
        // TODO: Implement

        return this.mockScheduleArr[0];
    }

    static getAllSchedulesForDateTime(dateAsEpoch: string): Schedule[] {
        // TODO: Implement
        let receivedArr = [];
        this.db.serialize(() => {
            this.db.each(Sqlite_consts.SELECT_SCHEDULES_FOR_DATE, dateAsEpoch, (err, row) => {
                if (err) return;

                receivedArr.push(row);
                console.log(row);

            });
        });


        return this.mockScheduleArr;
    }

    static async getBellPathByName(bellName: string): Promise<Bell> {
        let bellToReturn: Bell = null;
        this.db.serialize(() => {
            this.db.each(Sqlite_consts.SELECT_BELL_BY_NAME, bellName, (err, row: Bell) => {
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