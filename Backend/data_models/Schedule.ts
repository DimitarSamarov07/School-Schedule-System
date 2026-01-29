import Subject from "./Subject.ts";
import Class from "./Class.ts";
import Period from "./Period.ts";
import Teacher from "./Teacher.js";
import Room from "./Room.js";
import School from "./School.ts";


class Schedule {
    Class: Class;
    Date: number;
    Subject: Subject;
    School: School;
    Teacher: Teacher;
    Period: Period;
    Room: Room;

    constructor(scheduleClass: Class, date: number, teacher: Teacher, subject: Subject, school: School, period: Period, room: Room) {
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
            schoolId,
            schoolName,
            schoolAddress,
            subjectName,
            description,
            teacherName,
            teacherEmail,
            className,
            homeRoomId,
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
        let classModel = new Class(schoolId, className, homeRoomId);
        let school = new School(schoolId, schoolName, schoolAddress, null);

        return new Schedule(classModel, Date.now(), teacher, subject, school, time, room);

    }
}

export default Schedule;