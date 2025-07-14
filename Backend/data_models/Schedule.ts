import Course from "./Course.ts";
import Class from "./Class.ts";
import DateModel from "./DateModel.ts";
import Time from "./Time.js";
import Teacher from "./Teacher.js";
import Room from "./Room.js";

class Schedule {
    Class: Class;
    Course: Course;
    Times: Time;
    Date: DateModel;

    constructor(scheduleClass: Class, course: Course, times: Time, date: DateModel) {
        this.Class = scheduleClass;
        this.Course = course;
        this.Times = times;
        this.Date = date;
    }

    static convertFromDBModel(schedule: any) {
        let {
            courseId,
            courseName,
            teacherId,
            firstName,
            lastName,
            classId,
            className,
            classDesc,
            dateId,
            date,
            isHoliday,
            roomId,
            roomName,
            floor,
            timeId,
            startTime,
            endTime
        } = schedule;

        let time = new Time(timeId, startTime, endTime);
        let dateModel = new DateModel(dateId, date, isHoliday);
        let teacher = new Teacher(teacherId, firstName, lastName);
        let room = new Room(roomId, roomName, floor);
        let course = new Course(courseId, courseName, teacher, room);
        let classModel = new Class(classId, className, classDesc);

        return new Schedule(classModel, course, time, dateModel);

    }
}

export default Schedule;