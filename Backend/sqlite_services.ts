//
//
//     /**
//      * Retrieves all schedules for a specified date.
//      *
//      * @param {string} date - The date for which schedules are to be retrieved, in the format 'YYYY-MM-DD'.
//      * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects corresponding to the provided date.
//      * In case of an error, the promise enters rejection and returns a generic error as a string.
//      */
//     static getAllSchedulesForDate(date: string): Promise<Schedule[]> {
//         let receivedArr = [];
//
//         return new Promise((resolve, reject) => {
//             //The .each method runs the given query for EACH row
//             this.db.each(SqliteConstants.SELECT_SCHEDULES_FOR_DATE, date, (err, row) => {
//                 if (err) {
//                     console.error(err);
//                     reject("Database error");
//                     return;
//                 }
//                 try {
//                     let schedule = Schedule.convertFromDBModel(row);
//                     receivedArr.push(schedule);
//                 } catch (e) {
//                     console.error(e);
//                     reject("Something went wrong when parsing the data models. A DB inconsistency ?")
//                     return;
//                 }
//             }, () => {
//                 resolve(receivedArr);
//             });
//         });
//     }
//
//     /**
//      * Retrieves all schedules for the specified date and time.
//      *
//      * @param {string} date - The date for which schedules need to be retrieved, formatted as YYYY-MM-DD.
//      * @param {string} time - The time for which schedules need to be retrieved, formatted as HH:MM.
//      * @return {Promise<Schedule[]>} A promise that resolves to an array of Schedule objects matching the provided date and time, or rejects with a generic error as a string, in case of a database issue.
//      */
//     static getAllSchedulesForDateTime(date: string, time: string): Promise<Schedule[]> {
//         let receivedArr = [];
//
//         return new Promise((resolve, reject) => {
//             //The .each method runs the given query for EACH row
//             this.db.each(SqliteConstants.SELECT_SCHEDULES_BY_DATE_AND_TIME_AND_SCHOOL, [date, time], (err, row) => {
//                 if (err) {
//                     console.error(err);
//                     reject("Database error");
//                     return;
//                 }
//                 let schedule = Schedule.convertFromDBModel(row);
//                 receivedArr.push(schedule);
//             }, () => {
//                 resolve(receivedArr);
//             });
//         });
//     }
//
//


//      * Creates a new schedule entry with the provided course, class, teacher, and date information.
//      *
//      * @param {number} courseId - The ID of the course associated with the schedule.
//      * @param {number} classId - The ID of the class associated with the schedule.
//      * @param {number} teacherId - The ID of the teacher associated with the schedule.
//      * @param {number} dateId - The ID of the date associated with the schedule.
//      * @return {Promise<ScheduleResponse>} A promise that resolves to a ScheduleResponse object containing the schedule details.
//      */
//     static async createSchedule(courseId: number, classId: number, teacherId: number, dateId: number): Promise<ScheduleResponse> {
//         await this.createBase(SqliteConstants.INSERT_INTO_SCHEDULE, [courseId, classId, teacherId, dateId])
//             .catch(err => {
//                 return Promise.reject(err);
//             })
//         return new ScheduleResponse(classId, courseId, teacherId, dateId)
//     }

//      * Updates the schedule with new class, course, time, and date information while removing the old schedule details.
//      *
//      * @param {number} oldClassId - The ID of the old class to be updated.
//      * @param {number} oldCourseId - The ID of the old course to be updated.
//      * @param {number} oldDateId - The ID of the old date to be updated.
//      * @param {number | null} classId - The new class ID to update to, or null if not changing.
//      * @param {number | null} courseId - The new course ID to update to, or null if not changing.
//      * @param {number | null} timeId - The new time ID to update to, or null if not changing.
//      * @param {number | null} dateId - The new date ID to update to, or null if not changing.
//      * @return {Promise<ScheduleResponse>} A promise resolving to a `ScheduleResponse` object containing the updated schedule information.
//      */
//     static async updateSchedule(oldClassId: number, oldCourseId: number, oldDateId: number, classId: number | null, courseId: number | null, timeId: number | null, dateId: number | null): Promise<ScheduleResponse> {
//         let response = await this.updateBase(SqliteConstants.UPDATE_SCHEDULE, [courseId, classId, timeId, dateId, oldClassId, oldCourseId, oldDateId])
//             .catch(err => {
//                 return Promise.reject(err);
//             })
//
//         if (!response) {
//             return null;
//         }
//
//         if (!response) {
//             return null;
//         }
//
//         return new ScheduleResponse(response.Class, response.Course, response.T_id, response.D_id);
//     }
//

//      * Deletes a schedule from the database based on the provided course ID, class ID, and time ID.
//      *
//      * @param {number} courseId - The unique identifier of the course.
//      * @param {number} classId - The unique identifier of the class.
//      * @param {number} timeId - The unique identifier of the time slot.
//      * @return {Promise<boolean>} A promise that resolves to true if the schedule was successfully deleted, otherwise rejects with an error.
//      */
//     static async deleteSchedule(courseId: number, classId: number, timeId: number): Promise<boolean> {
//         return await this.deleteBase(SqliteConstants.DELETE_FROM_SCHEDULES, [courseId, classId, timeId]).catch(err => {
//             return Promise.reject(err);
//         })
//     }
//
//     static async registerNewAdmin(username: string, email: string, password: string) {
//         let hashedPassword = await this.hashPassword(password);
//
//         return new Promise((resolve, reject) => {
//             this.db.get(SqliteConstants.CREATE_USER, [username, email, hashedPassword], (err, row: any) => {
//                 if (err) {
//                     console.error(err);
//                     reject("Database error");
//                     return;
//                 }
//                 resolve(row);
//             })
//         })
//     }
//
//     static async updateAdminEmail(username: string, newEmail: string, currentPassword: string) {
//         return new Promise(async (resolve, reject) => {
//             let isThisTheCurrentUser = await this.checkAdminCredentials(username, currentPassword);
//             if(!isThisTheCurrentUser){
//                 return resolve(false);
//             }
//
//             this.db.get(SqliteConstants.UPDATE_USER_EMAIL, [newEmail, username, currentPassword], (err, row: any) => {
//                 if (err) {
//                     console.error(err);
//                     reject("Database error");
//                     return;
//                 }
//                 resolve(row);
//             })
//         })
//     }
//
//     static async updateAdminPassword(username: string, newPass: string, currentPassword: string) {
//         return new Promise(async (resolve, reject) => {
//             let isThisTheCurrentUser = await this.checkAdminCredentials(username, currentPassword);
//             if(!isThisTheCurrentUser){
//                 return resolve(false);
//             }
//
//             this.db.get(SqliteConstants.UPDATE_USER_PASS, [newPass, username, currentPassword], (err, row: any) => {
//                 if (err) {
//                     console.error(err);
//                     reject("Database error");
//                     return;
//                 }
//                 resolve(row);
//             })
//         })
//     }
//
//     static async checkAdminCredentials(username: string, password: string) {
//         let hashedPassword = await this.hashPassword(password);
//
//         return new Promise((resolve, reject) => {
//             this.db.get(SqliteConstants.CHECK_ADMIN_CREDENTIALS, [username, hashedPassword], (err, row: any) => {
//                 if (err) {
//                     console.error(err);
//                     resolve(false);
//                     return;
//                 }
//                 if (row) {
//                     let pass = row[0];
//                     if(bcrypt.compare(hashedPassword, pass)){
//                         return resolve(true);
//                     }
//                     else{
//                         return resolve(false);
//                     }
//                 }
//                 return resolve(false);
//             })
//         })
//     }
//
//
//     private static async hashPassword(password: string): Promise<string> {
//         return await bcrypt.hash(password, this.saltRounds);
//     }
//