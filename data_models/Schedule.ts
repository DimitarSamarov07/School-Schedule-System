import Course from "./Course.ts";
import Class from "./Class.ts";
import DateModel from "./DateModel.ts";
import type Time from "./Time.js";
import Teacher from "./Teacher.js";

class Schedule {
    Class: Class;
    Course: Course;
    Times: Time;
    Date: DateModel;

    constructor(scheduleClass: Course, course: Class, times: Teacher, date: DateModel) {
        this.Class = scheduleClass;
        this.Course = course;
        this.Times = times;
        this.Date = date;
    }
}

export default Schedule;