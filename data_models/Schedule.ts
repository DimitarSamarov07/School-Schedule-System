import Course from "./Course.ts";
import Class from "./Class.ts";
import Teacher from "./Teacher.ts";
import DateModel from "./DateModel.ts";

class Schedule {
    Course: Course;
    Class: Class;
    Teacher: Teacher;
    Date: DateModel;

    constructor(course: Course, scheduleClass: Class, teacher: Teacher , date: DateModel) {
        this.Course = course;
        this.Class = scheduleClass;
        this.Teacher = teacher ;
        this.Date = date;
    }
}

export default Schedule;