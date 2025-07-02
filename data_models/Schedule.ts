import Course from "./Course";
import Class from "./Class";
import Teacher from "./Teacher";
import DateModel from "./DateModel";

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