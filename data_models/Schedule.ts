import Course from "./Course.ts";
import Class from "./Class.ts";
import Teacher from "./Teacher.ts";
import DateModel from "./DateModel.ts";

class Schedule {
    course: Course;
    class: Class;
    teacher: Teacher;
    date: DateModel;

    constructor(course: Course, scheduleClass: Class, teacher: Teacher , date: DateModel) {
        this.course = course;
        this.class = scheduleClass;
        this.teacher = teacher ;
        this.date = date;
    }
}

export default Schedule;