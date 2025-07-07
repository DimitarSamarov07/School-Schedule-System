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

/**
 * Represents a manager for handling SQLite-related operations.
 * Provides methods to interact with the database, retrieve schedules,
 * manage connections, and handle various entity data.
 */
class SqliteMaster {
    static mockScheduleArr: Schedule[];
    /**
     * The relative file path to the database file.
     * This variable specifies the location of the database file
     * used by the application. It points to the default
     * database.
     */
    static readonly DATABASE_PATH: string = "./dev.db";

    /**
     * Represents the database connection instance used to interact with
     * a specific database. This object provides methods to perform
     * queries, manipulate data, and manage database transactions.
     */
    static db: Database;

    /**
     * Constructor for initializing mock data.
     * This sets up initial mock objects including Room, Class, Teacher, Course, DateModel, and Time,
     * and populates a mock schedule array in SqliteMaster.
     *
     * @return {void} This constructor does not return a value.
     */
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

    /**
     * Initializes the database connection using SQLite and sets up the database instance.
     * @return {void} This method does not return a value.
     */
    static initializeConnection(): void {
        const sqlite = sqlite3.verbose();
        this.db = new sqlite.Database(this.DATABASE_PATH);
    }

    /**
     * Disconnects from the database while closing the file safely.
     */
    static disconnectFromDB(): void {
        this.db.close()
    }


    /**
     * Retrieves a list of schedules for a specific class and date.
     *
     * @param {number} classId - The ID of the class for which schedules are to be retrieved.
     * @param {string} date - The date for which schedules are to be retrieved, formatted as a string as YYYY-MM-DD.
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects for the specified class and date.
     * Rejection will return a generic error in a string format
     */
    static async getSchedulesByClassIdForDate(classId: number, date: string): Promise<Schedule[]> {
        let schedulesToReturn: Schedule[] = [];
        return new Promise((resolve, reject) => {
            this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE_AND_CLASS_ID, [date, classId], (err, row: any) => {
                if (err) {
                    console.error(err);
                    reject(err)
                    return;
                }
                schedulesToReturn.push(Schedule.convertFromDBModel(row));
            }, () => {
                resolve(schedulesToReturn);
            })
        });
    }

    /**
     * Retrieves the current running time by checking database entries for active time periods
     * and breaks. It determines whether the current time is within a defined timeframe or break.
     *
     * @return {Promise<RunningTime>} A promise that resolves to a RunningTime object indicating
     * the active time period or break. Returns a RunningTime object with -1 as the numberInSchedule for active
     *  breaks. Otherwise, the according number in schedule will be return.  THe promise rejects with an error message if an issue occurs during database operations or
     * data parsing.
     */
    static async getRunningTime(): Promise<RunningTime> {
        let isInBreak: boolean;
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(SqliteConstants.SELECT_ALL_TIMES, [], (err, rows: any) => {
                    if (err) {
                        console.error(err);
                        reject("Something went wrong with the database request. Contact the administrator.");
                        return;
                    }
                    try {
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
                    } catch (e) {
                        console.error(e);
                        reject("Something went wrong when parsing the dates. Database error?")
                        return;
                    }

                });
                if (isInBreak == null) {
                    this.db.all(SqliteConstants.SELECT_BREAKS, [], (err, rows: any) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                            return;
                        }
                        try {
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
                        } catch (e) {
                            console.error(err);
                            reject("A malformed database entry ?");
                            return;
                        }

                    });
                }
            })
        });
    }

    /**
     * Retrieves all schedules for a specified date.
     *
     * @param {string} date - The date for which schedules are to be retrieved, in the format 'YYYY-MM-DD'.
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects corresponding to the provided date.
     * In case of an error, the promise enters rejection and returns a generic error as a string.
     */
    static getAllSchedulesForDate(date: string): Promise<Schedule[]> {
        let receivedArr = [];

        return new Promise((resolve, reject) => {
            //The .each method runs the given query for EACH row
            this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE, date, (err, row) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                try {
                    let schedule = Schedule.convertFromDBModel(row);
                    receivedArr.push(schedule);
                } catch (e) {
                    console.error(e);
                    reject("Something went wrong when parsing the data models. A DB inconsistency ?")
                    return;
                }
            }, () => {
                resolve(receivedArr);
            });
        });
    }

    /**
     * Retrieves all schedules for the specified date and time.
     *
     * @param {string} date - The date for which schedules need to be retrieved, formatted as YYYY-MM-DD.
     * @param {string} time - The time for which schedules need to be retrieved, formatted as HH:MM.
     * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects matching the provided date and time, or rejects with a generic error as a string, in case of a database issue.
     */
    static getAllSchedulesForDateTime(date: string, time: string): Promise<Schedule[]> {
        let receivedArr = [];

        return new Promise((resolve, reject) => {
            //The .each method runs the given query for EACH row
            this.db.each(SqliteConstants.SELECT_SCHEDULES_BY_DATE_AND_TIME, [date, time], (err, row) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                let schedule = Schedule.convertFromDBModel(row);
                receivedArr.push(schedule);
            }, () => {
                resolve(receivedArr);
            });
        });
    }


    /**
     * Retrieves a Bell object based on its name from the database.
     *
     * @param {string} bellName - The name of the bell to retrieve.
     * @return {Promise<Bell>} A promise that resolves to a Bell object if found, or rejects with a generic error message as a string.
     */
    static async getBellPathByName(bellName: string): Promise<Bell> {
        let bellToReturn: Bell = null;
        return new Promise((resolve, reject) => {
            this.db.each(SqliteConstants.SELECT_BELL_BY_NAME, bellName, (err, row: Bell) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                bellToReturn = new Bell(row.Id, row.Name, row.SoundPath);
                resolve(bellToReturn);
            })
        });
    }

}

export default SqliteMaster;