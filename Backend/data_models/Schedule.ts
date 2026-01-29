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
            date,
            schoolId,
            schoolName,
            schoolAddress,
            workWeekConfig,
            subjectName,
            description,
            teacherName,
            teacherEmail,
            className,
            roomName,
            floor,
            capacity,
            periodName,
            startTime,
            endTime
        } = schedule;

        let time = new Period(schoolId, periodName, startTime, endTime);
        let teacher = new Teacher(schoolId, teacherName, teacherEmail);
        let room = new Room(schoolId, roomName, floor, capacity);
        let subject = new Subject(schoolId, subjectName, description);
        let classModel = new Class(schoolId, className, room);
        let school = new School(schoolId, schoolName, schoolAddress, workWeekConfig);
        let dateString = moment(date).format("YYYY-MM-DD");
        return new Schedule(classModel, dateString, teacher, subject, school, time, room);

    }
}

export default Schedule;