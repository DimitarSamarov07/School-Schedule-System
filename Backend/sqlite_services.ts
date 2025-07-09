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

    /**
     * Creates a new teacher entry in the database and returns a response object with the teacher details.
     *
     * @param {string} firstName - The first name of the teacher.
     * @param {string} lastName - The last name of the teacher.
     * @return {Promise<TeacherResponse>} A promise that resolves to a TeacherResponse object containing the teacher's details.
     */
    static async createTeacher(firstName: string, lastName: string): Promise<TeacherResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_TEACHERS, [firstName, lastName])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TeacherResponse(id, firstName, lastName);
    }

    /**
     * Creates a new class entry in the database with the specified name and description.
     *
     * @param {string} name - The name of the class to create.
     * @param {string} description - The description of the class.
     * @return {Promise<ClassResponse>} A promise that resolves with a ClassResponse object containing the details of the created class.
     */
    static async createClass(name: string, description: string): Promise<ClassResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_CLASSES, [name, description])
            .catch(err => {
                return Promise.reject(err);
            })
        return new ClassResponse(id, name, description);
    }

    /**
     * Creates a new room with the given name and floor number in the database.
     *
     * @param {string} name - The name of the room to be created.
     * @param {number} floor - The floor number where the room is located.
     * @return {Promise<RoomResponse>} A promise that resolves to an instance of RoomResponse containing details of the created room.
     */
    static async createRoom(name: string, floor: number): Promise<RoomResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_ROOMS, [name, floor])
            .catch(err => {
                return Promise.reject(err);
            })
        return new RoomResponse(id, name, floor);
    }

    /**
     * Creates a new time entry in the database between the given start and end times.
     *
     * @param {string} start - The starting time for the time entry.
     * @param {string} end - The ending time for the time entry.
     * @return {Promise<TimeResponse>} A promise that resolves to a TimeResponse object containing the created time details.
     */
    static async createTime(start: string, end: string): Promise<TimeResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_TIMES, [start, end])
            .catch(err => {
                return Promise.reject(err);
            })
        return new TimeResponse(id, start, end);
    }

    /**
     * Creates a new date entry in the database and returns a response object.
     *
     * @param {string} date - The date to be recorded, formatted as a string.
     * @param {boolean} isHoliday - Indicates whether the date is a holiday.
     * @return {Promise<DateModelResponse>} A promise that resolves to a DateModelResponse object containing the created date information.
     */
    static async createDate(date: string, isHoliday: boolean): Promise<DateModelResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_DATES, [date, isHoliday])
            .catch(err => {
                return Promise.reject(err);
            })
        return new DateModelResponse(id, date, isHoliday)
    }

    /**
     * Creates a new course with the specified name, teacher, and room details.
     *
     * @param {string} name - The name of the course to be created.
     * @param {number} teacherId - The ID of the teacher assigned to the course.
     * @param {number} roomId - The ID of the room where the course will take place.
     * @return {Promise<CourseResponse>} A promise that resolves with the created course's details encapsulated in a `CourseResponse` object.
     */
    static async createCourse(name: string, teacherId: number, roomId: number): Promise<CourseResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_COURSES, [name, teacherId, roomId])
            .catch(err => {
                return Promise.reject(err);
            })
        return new CourseResponse(id, name, teacherId, roomId)
    }

    /**
     * Creates a new schedule entry with the provided course, class, teacher, and date information.
     *
     * @param {number} courseId - The ID of the course associated with the schedule.
     * @param {number} classId - The ID of the class associated with the schedule.
     * @param {number} teacherId - The ID of the teacher associated with the schedule.
     * @param {number} dateId - The ID of the date associated with the schedule.
     * @return {Promise<ScheduleResponse>} A promise that resolves to a ScheduleResponse object containing the schedule details.
     */
    static async createSchedule(courseId: number, classId: number, teacherId: number, dateId: number): Promise<ScheduleResponse> {
        await this.createBase(SqliteConstants.INSERT_INTO_SCHEDULE, [courseId, classId, teacherId, dateId])
            .catch(err => {
                return Promise.reject(err);
            })
        return new ScheduleResponse(classId, courseId, teacherId, dateId)
    }

    /**
     * Creates a new bell using the given name and sound path, storing the information in the database.
     *
     * @param {string} name - The name of the bell to be created.
     * @param {string} soundPath - The path to the sound file associated with the bell.
     * @return {Promise<BellResponse>} A Promise that resolves to an instance of BellResponse containing the details of the created bell.
     */
    static async createBell(name: string, soundPath: string): Promise<BellResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_BELLS, [name, soundPath])
            .catch(err => {
                return Promise.reject(err);
            })

        return new BellResponse(id, name, soundPath);
    }

    /**
     * Creates a new advertising entry in the database and returns a response object with the details of the created entry.
     *
     * @param {string} content The content of the advertising.
     * @param {string} imagePath The file path to the image associated with the advertising.
     * @return {Promise<AdvertisingResponse>} A promise that resolves with an AdvertisingResponse object containing the ID, content, and image path of the created advertising entry.
     */
    static async createAdvertising(content: string, imagePath: string): Promise<AdvertisingResponse> {
        let {id} = await this.createBase(SqliteConstants.INSERT_INTO_ADVERTISING, [content, imagePath])
            .catch(err => {
                return Promise.reject(err);
            })

        return new AdvertisingResponse(id, content, imagePath);
    }


    /**
     * Updates an existing advertisement in the database with new content and/or imagePath values.
     *
     * @param {number} id - The unique identifier of the advertisement to be updated.
     * @param {string|null} content - The new content for the advertisement. Can be null to clear the content field.
     * @param {string|null} imagePath - The new image path for the advertisement. Can be null to clear the imagePath field.
     * @return {Promise<AdvertisingResponse>} A promise that resolves to an updated AdvertisingResponse object.
     */
    static async updateAdvertising(id: number, content: string | null, imagePath: string | null) {
        let advertisement = new AdvertisingResponse(id, content, imagePath);
        let response = await this.updateBase(SqliteConstants.UPDATE_ADVERTISING, [content, imagePath, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(advertisement, response);
        return advertisement;
    }

    /**
     * Updates an existing bell in the database with the provided details.
     *
     * @param {number} id - The unique identifier of the bell to update.
     * @param {string | null} name - The new name for the bell. Can be null to retain the current name.
     * @param {string | null} soundPath - The new sound path for the bell. Can be null to retain the current sound path.
     * @return {Promise<BellResponse>} Returns a Promise resolving to an updated BellResponse object reflecting the updated properties of the bell.
     */
    static async updateBell(id: number, name: string | null, soundPath: string | null) {
        let bell = new BellResponse(id, name, soundPath);
        let response = await this.updateBase(SqliteConstants.UPDATE_BELL, [name, soundPath, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(bell, response);
        return bell;
    }

    /**
     * Updates a class in the database with the given id, name, and description.
     *
     * @param {number} id - The unique identifier of the class to be updated.
     * @param {string | null} name - The new name of the class, or null if not being updated.
     * @param {string | null} description - The new description of the class, or null if not being updated.
     * @return {Promise<ClassResponse>} A promise that resolves to the updated class object.
     */
    static async updateClass(id: number, name: string | null, description: string | null): Promise<ClassResponse> {
        let classObj = new ClassResponse(id, name, description);
        let response = await this.updateBase(SqliteConstants.UPDATE_CLASS, [name, description, id])
            .catch(err => {
                return Promise.reject(err);
            })
        Object.assign(classObj, response);
        return classObj;
    }

    /**
     * Updates an existing course with the provided information.
     *
     * @param {number} id - The unique identifier of the course to be updated.
     * @param {string | null} name - The new name of the course, or null to leave it unchanged.
     * @param {number | null} teacherId - The ID of the teacher associated with the course, or null to leave it unchanged.
     * @param {number | null} roomId - The ID of the room assigned to the course, or null to leave it unchanged.
     * @return {Promise<CourseResponse>} A promise that resolves to a CourseResponse object containing the updated course details.
     */
    static async updateCourse(id: number, name: string | null, teacherId: number | null, roomId: number | null): Promise<CourseResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_COURSE, [name, teacherId, roomId, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new CourseResponse(response.id, response.Name, response.Teacher, response.Room);
    }

    /**
     * Updates the information of a room in the database based on the provided parameters.
     *
     * @param {number} id - The unique identifier of the room to update.
     * @param {string|null} name - The new name of the room, or null to leave it unchanged.
     * @param {number|null} floor - The new floor of the room, or null to leave it unchanged.
     * @return {Promise<RoomResponse>} A promise that resolves to a RoomResponse object containing the updated room details.
     */
    static async updateRoom(id: number, name: string | null, floor: number | null): Promise<RoomResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_ROOM, [name, floor, id])
            .catch(err => {
                return Promise.reject(err);
            })
        return new RoomResponse(response.id, response.Name, response.Floor);
    }

    /**
     * Updates the date information in the database based on the provided parameters.
     *
     * @param {number} id - The unique identifier of the record to be updated.
     * @param {string|null} date - The new date value to be updated, or null if no change.
     * @param {boolean|null} isHoliday - Indicates whether the date is a holiday (true or false) or null if no change.
     * @return {Promise<DateModelResponse>} Returns a promise that resolves to a DateModelResponse object containing updated record details, or null if the update fails.
     */
    static async updateDate(id: number, date: string | null, isHoliday: boolean | null): Promise<DateModelResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_DATE, [date, isHoliday, id])
            .catch(err => {
                return Promise.reject(err);
            })

        if (!response) {
            return null;
        }

        return new DateModelResponse(response.id, response.Date, response.IsHoliday);
    }

    /**
     * Updates the schedule with new class, course, time, and date information while removing the old schedule details.
     *
     * @param {number} oldClassId - The ID of the old class to be updated.
     * @param {number} oldCourseId - The ID of the old course to be updated.
     * @param {number} oldDateId - The ID of the old date to be updated.
     * @param {number | null} classId - The new class ID to update to, or null if not changing.
     * @param {number | null} courseId - The new course ID to update to, or null if not changing.
     * @param {number | null} timeId - The new time ID to update to, or null if not changing.
     * @param {number | null} dateId - The new date ID to update to, or null if not changing.
     * @return {Promise<ScheduleResponse>} A promise resolving to a `ScheduleResponse` object containing the updated schedule information.
     */
    static async updateSchedule(oldClassId: number, oldCourseId: number, oldDateId: number, classId: number | null, courseId: number | null, timeId: number | null, dateId: number | null): Promise<ScheduleResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_SCHEDULE, [courseId, classId, timeId, dateId, oldClassId, oldCourseId, oldDateId])
            .catch(err => {
                return Promise.reject(err);
            })

        if (!response) {
            return null;
        }

        if (!response) {
            return null;
        }

        return new ScheduleResponse(response.Class, response.Course, response.T_id, response.D_id);
    }

    /**
     * Updates the time details for a specific record.
     *
     * @param {number} id - The unique identifier of the record to update.
     * @param {string | null} start - The starting time to be set, or null to unset it.
     * @param {string | null} end - The ending time to be set, or null to unset it.
     * @return {Promise<TimeResponse>} A promise that resolves to a TimeResponse object containing updated details, or null if the update failed.
     */
    static async updateTime(id: number, start: string | null, end: string | null): Promise<TimeResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_TIME, [start, end, id])
            .catch(err => {
                return Promise.reject(err);
            })

        if (!response) {
            return null;
        }

        return new TimeResponse(response.id, response.Start, response.End);
    }

    /**
     * Updates the details of a teacher in the database.
     *
     * @param {number} id - The unique identifier of the teacher to be updated.
     * @param {string | null} firstName - The updated first name of the teacher, or null if it is not being updated.
     * @param {string | null} lastName - The updated last name of the teacher, or null if it is not being updated.
     * @return {Promise<TeacherResponse>} A promise that resolves to a TeacherResponse object containing the updated information of the teacher, or null if the update fails.
     */
    static async updateTeacher(id: number, firstName: string | null, lastName: string | null): Promise<TeacherResponse> {
        let response = await this.updateBase(SqliteConstants.UPDATE_TEACHER, [firstName, lastName, id])
            .catch(err => {
                return Promise.reject(err);
            })

        if (!response) {
            return null;
        }

        return new TeacherResponse(response.id, response.FirstName, response.LastName);
    }

    /**
     * Deletes a teacher from the database using the given teacher ID.
     *
     * @param {number} id - The unique identifier of the teacher to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the teacher is successfully deleted, or rejects with an error if the operation fails.
     */
    static async deleteTeacher(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_TEACHERS, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a specific advertising entry from the database based on the provided ID.
     *
     * @param {number} id - The ID of the advertising entry to be deleted.
     * @return {Promise<boolean>} Returns a promise that resolves to true if the deletion was successful, or rejects with an error if it fails.
     */
    static async deleteAdvertising(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_ADVERTISING, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a bell record from the database specified by the given ID.
     *
     * @param {number} id - The ID of the bell record to delete.
     * @return {Promise<boolean>} A promise that resolves to true if the deletion was successful, or rejects with an error if the deletion fails.
     */
    static async deleteBell(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_BELLS, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a class from the database based on the given ID.
     *
     * @param {number} id - The unique identifier of the class to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the class was successfully deleted, or rejects with an error otherwise.
     */
    static async deleteClass(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_CLASSES, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a course from the database using the provided course ID.
     *
     * @param {number} id - The unique identifier of the course to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the course is successfully deleted, or rejects with an error if the operation fails.
     */
    static async deleteCourse(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_COURSES, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a date record from the database based on the provided identifier.
     *
     * @param {number} id - The identifier of the date record to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the operation succeeds or rejects with an error if it fails.
     */
    static async deleteDate(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_DATES, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a room from the database using the specified room ID.
     *
     * @param {number} id - The unique identifier of the room to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the room is successfully deleted,
     * or rejects with an error if the operation fails.
     */
    static async deleteRoom(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_ROOMS, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a time entry from the database based on the provided ID.
     *
     * @param {number} id - The ID of the time entry to be deleted.
     * @return {Promise<boolean>} A promise that resolves to true if the deletion was successful, or rejects with an error.
     */
    static async deleteTime(id: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_TIMES, [id]).catch(err => {
            return Promise.reject(err);
        })
    }

    /**
     * Deletes a schedule from the database based on the provided course ID, class ID, and time ID.
     *
     * @param {number} courseId - The unique identifier of the course.
     * @param {number} classId - The unique identifier of the class.
     * @param {number} timeId - The unique identifier of the time slot.
     * @return {Promise<boolean>} A promise that resolves to true if the schedule was successfully deleted, otherwise rejects with an error.
     */
    static async deleteSchedule(courseId: number, classId: number, timeId: number): Promise<boolean> {
        return await this.deleteBase(SqliteConstants.DELETE_FROM_SCHEDULE, [courseId, classId, timeId]).catch(err => {
            return Promise.reject(err);
        })
    }


    /**
     * Executes a database query to fetch a single row and wraps the result in a ReturningId object.
     *
     * @param {string} query - The SQL query to be executed.
     * @param {any[]} params - An array of parameters for the SQL query.
     * @return {Promise<ReturningId>} A promise that resolves to a ReturningId object containing the fetched row's id.
     */
    private static createBase(query: string, params: any[]): Promise<ReturningId> {
        return new Promise((resolve, reject): void => {
            this.db.get(query, params, (err, row: any) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                let returningId = new ReturningId(row?.id);
                return resolve(returningId)
            })
        })
    }

    /**
     * Executes a database query with the provided parameters and handles the result.
     *
     * @param {string} query The SQL query to be executed.
     * @param {any[]} params The parameters to be used in the SQL query.
     * @return {Promise<any>} A promise that resolves with the first row of the result set if successful,
     *                        resolves with `false` if no rows are returned, or rejects with an error message
     *                        in case of a database error.
     */
    private static updateBase(query: string, params: any[]): Promise<any> {
        return new Promise((resolve, reject): void => {
            this.db.all(query, params, (err, rows: any[]) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                if (rows.length == 0) {
                    return resolve(false);
                }
                resolve(rows[0]);
            })
        })
    }

    /**
     * Executes a database query for deletion and resolves with the operation status.
     *
     * @param {string} query - The SQL query string to be executed.
     * @param {any[]} params - An array of parameters to bind to the query placeholders.
     * @return {Promise<any>} A promise that resolves to `true` if the operation is successful and rows are affected, `false` if no rows are affected, or rejects with an error message in case of a database error.
     */
    private static deleteBase(query: string, params: any[]): Promise<any> {
        return new Promise((resolve, reject): void => {
            this.db.all(query, params, (err, rows: any[]) => {
                if (err) {
                    console.error(err);
                    reject("Database error");
                    return;
                }
                if (rows.length == 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }

            })
        })
    }

}

export default SqliteMaster;