import DateModel from "./data_models/DateModel.js";
import Schedule from "./data_models/Schedule.js";
import Course from "./data_models/Course.js";
import Teacher from "./data_models/Teacher.js";
import Room from "./data_models/Room.js";
import Class from "./data_models/Class.js";

class SqliteMaster {
    static mockScheduleArr: Schedule[];

    constructor() {
        // Initialize mock data
        let testRoom =  new Room(1, "test", 1)
        let testClass = new Class(1, "test", "test")
        let testTeacher = new Teacher(1, "test", "test")
        let testCourse = new Course(1, "test", testTeacher, testRoom)
        let testDate = new DateModel(1, new Date(), false)
        SqliteMaster.mockScheduleArr = [new Schedule(testCourse, testClass, testTeacher, testDate)]
    }

    static initializeConnection(): void {
        // TODO: Implement
    }

    static disconnectFromDB(): void {
        // TODO: Implement
    }

    static getSchedulesByDate(): Schedule[] {
        // TODO: Implement

        return this.mockScheduleArr;
    }

    static getScheduleByClassIdForDate(classId: number, date: DateModel): Schedule {
        // TODO: Implement

        return this.mockScheduleArr[0];
    }

    static getAllSchedulesForDateTime(date: DateModel): Schedule[] {
        // TODO: Implement

        return this.mockScheduleArr;
    }

}

export default SqliteMaster;