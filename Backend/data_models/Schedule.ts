import Subject from "./Subject.ts";
import Class from "./Class.ts";
import Period from "./Period.ts";
import Teacher from "./Teacher.js";
import Room from "./Room.js";
import School from "./School.ts";
import moment from "moment";


class Schedule {
    Class: Class;
    Date: string;
    Subject: Subject;
    School: School;
    Teacher: Teacher;
    Period: Period;
    Room: Room;

    constructor(scheduleClass: Class, date: string, teacher: Teacher, subject: Subject, school: School, period: Period, room: Room) {
        this.Class = scheduleClass;
        this.Date = date;
        this.Teacher = teacher;
        this.Subject = subject;
        this.School = school;
        this.Period = period;
        this.Room = room;
    }

    static convertFromDBModel(schedule: any) {
        let {
            scheduleDate,
            schoolId,
            schoolName,
            schoolAddress,
            workWeekConfig,

            subjectId,
            subjectName,
            description,

            teacherId,
            teacherName,
            teacherEmail,

            classId,
            className,
            classDescription,

            roomId,
            roomName,
            floor,
            capacity,

            periodId,
            periodName,
            startTime,
            endTime
        } = schedule;

        let period = new Period(periodId, schoolId, periodName, startTime, endTime);
        let teacher = new Teacher(teacherId, schoolId, teacherName, teacherEmail);
        let room = new Room(roomId, schoolId, roomName, floor, capacity);
        let subject = new Subject(subjectId, schoolId, subjectName, description);
        let classModel = new Class(classId, schoolId, className, classDescription, room);
        let school = new School(schoolId, schoolName, schoolAddress, workWeekConfig);
        let dateString = moment(scheduleDate).format("YYYY-MM-DD");
        return new Schedule(classModel, dateString, teacher, subject, school, period, room);

    }
}

export default Schedule;