import Schedule from "./data_models/Schedule.js";
import type {Database} from "sqlite3"
import sqlite3 from "sqlite3";
import Bell from "./data_models/Bell.js";
import Time from "./data_models/Time.js";
import SqliteConstants from "./sqlite_constants.js";
import RunningTime from "./response_models/RunningTime.js";
import moment from "moment";
import ReturningId from "./response_models/ReturningId.js";
import CourseResponse from "./response_models/CourseResponse.js";
import TeacherResponse from "./response_models/TeacherResponse.js";
import ClassResponse from "./response_models/ClassResponse.js";
import RoomResponse from "./response_models/RoomResponse.js";
import TimeResponse from "./response_models/TimeResponse.js";
import DateModelResponse from "./response_models/DateModelResponse.js";
import ScheduleResponse from "./response_models/ScheduleResponse.js";
import BellResponse from "./response_models/BellResponse.js";
import AdvertisingResponse from "./response_models/AdvertisingResponse.js";
import DateModel from "./data_models/DateModel.js";

/**
 * Represents a manager for handling SQLite-related operations.
 * Provides methods to interact with the database, retrieve schedules,
 * manage connections, and handle various entity data.
 */
class SqliteMaster {
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
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(SqliteConstants.SELECT_ALL_TIMES, [], (err, rows: any) => {
                    if (err) {
                        console.error(err);
                        reject("Something went wrong with the database request. Contact the administrator.");
                        return;
                    }

                    try {
                        const now = moment();
                        for (const row of rows) {
                            const parsedRow = new Time(row.id, row.Start, row.End);
                            const start = moment(parsedRow.Start, 'HH:mm');
                            const end = moment(parsedRow.End, 'HH:mm');

                            if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                                return resolve(new RunningTime(parsedRow.Id, parsedRow.Start, parsedRow.End));
                            }
                        }


                        this.db.all(SqliteConstants.SELECT_BREAKS, [], (err, rows: any) => {
                            if (err) {
                                console.error(err);
                                reject("Something went wrong checking breaks.");
                                return;
                            }

                            try {
                                for (const row of rows) {
                                    const parsedRow = new Time(row.id, row.Start, row.End);
                                    const start = moment(parsedRow.Start, 'HH:mm');
                                    const end = moment(parsedRow.End, 'HH:mm');

                                    if (start.isSameOrBefore(now) && end.isSameOrAfter(now)) {
                                        return resolve(new RunningTime(-1, parsedRow.Start, parsedRow.End));
                                    }
                                }
                                return resolve(new RunningTime(0, null, null));

                            } catch (e) {
                                console.error(e);
                                reject("Error parsing break entries.");
                            }
                        });

                    } catch (e) {
                        console.error(e);
                        reject("Error parsing time entries.");
                    }
                });
            });
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
     * Retrieves a date object from the database based on the provided date string.
     *
     * @param {string} date - The date string in 'YYYY-MM-DD' format used to query the database.
     * @return {Promise<DateModel>} A promise that resolves to a DateModel instance containing the date information,
     *                              or rejects with an error message if no data is found or a database error occurs.
     */
    static getDateFromDBByDate(date: string): Promise<DateModel> {
        return new Promise((resolve, reject) => {
            this.db.all(SqliteConstants.SELECT_DATE_BY_DATE, date, (err, rows: any) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                if (rows.length == 0) {
                    reject("No date found");
                    return;
                }
                let row = rows[0];
                let dateMoment = moment(row.Date, 'YYYY-MM-DD').toDate();
                let dateModel = new DateModel(row.id, dateMoment, rows[0].IsHoliday);
                return resolve(dateModel);
            })
        })
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
            this.db.each(SqliteConstants.SELECT_BELL_BY_NAME, bellName, (err, row: any) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                bellToReturn = new Bell(row.id, row.Name, row.SoundPath);
                resolve(bellToReturn);
            })
        });
    }

    static async createTeacher(firstName: string, lastName: string): Promise<TeacherResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_TEACHERS, [firstName, lastName])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TeacherResponse(id, firstName, lastName);
    }

    static async createClass(name: string, description: string): Promise<ClassResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_CLASSES, [name, description])
            .catch(err => {
                return Promise.reject(err);
            })
        return new ClassResponse(id, name, description);
    }

    static async createRoom(name: string, floor: number): Promise<RoomResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_ROOMS, [name, floor])
            .catch(err => {
                return Promise.reject(err);
            })
        return new RoomResponse(id, name, floor);
    }

    static async createTime(start: string, end: string): Promise<TimeResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_TIMES, [start, end])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TimeResponse(id, start, end);
    }

    static async createDate(date: string, isHoliday: boolean): Promise<DateModelResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_DATES, [date, isHoliday])
            .catch(err => {
                return Promise.reject(err);
            })
        return new DateModelResponse(id, date, isHoliday)
    }

    static async createCourse(name: string, teacherId: number, roomId: number): Promise<CourseResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_COURSES, [name, teacherId, roomId])
            .catch(err => {
                return Promise.reject(err);
            })
        return new CourseResponse(id, name, teacherId, roomId)
    }

    static async createSchedule(courseId: number, classId: number, teacherId: number, dateId: number): Promise<ScheduleResponse> {
        await this.createBase(SqliteConstants.INSERT_INTO_SCHEDULE, [courseId, classId, teacherId, dateId])
            .catch(err => {
                return Promise.reject(err);
            })
        return new ScheduleResponse(classId, courseId, teacherId, dateId)
    }

    static async createBell(name: string, soundPath: string): Promise<BellResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_BELLS, [name, soundPath])
            .catch(err => {
                return Promise.reject(err);
            })

        return new BellResponse(id, name, soundPath);
    }

    static async createAdvertising(content: string, imagePath: string): Promise<AdvertisingResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_ADVERTISING, [content, imagePath])
            .catch(err => {
                return Promise.reject(err);
            })

        return new AdvertisingResponse(id, content, imagePath);
    }


    static async updateAdvertising(id: number, content: string | null, imagePath: string | null) {
        let advertisement = new AdvertisingResponse(id, content, imagePath);
        let response = await this.updateBase(SqliteConstants.UPDATE_ADVERTISING, [content, imagePath, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(advertisement, response);
        return advertisement;
    }

    static async updateBell(id: number, name: string | null, soundPath: string | null) {
        let bell = new BellResponse(id, name, soundPath);
        let response = await this.updateBase(SqliteConstants.UPDATE_BELL, [name, soundPath, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(bell, response);
        return bell;
    }

    static async updateClass(id: number, name: string | null, description: string | null): Promise<ClassResponse> {
        let classObj = new ClassResponse(id, name, description);
        let response = await this.updateBase(SqliteConstants.UPDATE_CLASS, [name, description, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(classObj, response);
        return classObj;
    }

    static async updateCourse(id: number, name: string | null, teacherId: number | null, roomId: number | null): Promise<CourseResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_COURSE, [name, teacherId, roomId, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new CourseResponse(response.id, response.Name, response.Teacher, response.Room);
    }

    static async updateRoom(id: number, name: string | null, floor: number | null): Promise<RoomResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_ROOM, [name, floor, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new RoomResponse(response.id, response.Name, response.Floor);
    }

    static async updateDate(id: number, date: string | null, isHoliday: boolean | null): Promise<DateModelResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_DATE, [date, isHoliday, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new DateModelResponse(response.id, response.Date, response.IsHoliday);
    }

    static async updateSchedule(classId: number | null, courseId: number | null, timeId: number | null, dateId: number | null): Promise<ScheduleResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_SCHEDULE, [courseId, classId, timeId, dateId])
            .catch(err => {
                return Promise.reject(err);
            })
        return new ScheduleResponse(response.Class, response.Course, response.T_id, response.D_id);
    }

    static async updateTime(id: number, start: string | null, end: string | null): Promise<TimeResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_TIME, [start, end, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TimeResponse(response.id, response.Start, response.End);
    }

    static async updateTeacher(id: number, firstName: string | null, lastName: string | null): Promise<TeacherResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_TEACHER, [firstName, lastName, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TeacherResponse(response.id, response.FirstName, response.LastName);
    }


    private static createBase(query: string, params: any[]): Promise<ReturningId> {
        return new Promise((resolve, reject): void => {
            this.db.each(query, params, (err, row: any) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                let returningId = new ReturningId(row?.id);
                resolve(returningId)
            })
        })
    }

    private static updateBase(query: string, params: any[]): Promise<any> {
        return new Promise((resolve, reject): void => {
            this.db.all(query, params, (err, rows: any) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                resolve(rows[0]);
            })
        })
    }

}

export default SqliteMaster;