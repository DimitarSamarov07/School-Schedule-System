class ScheduleResponse {
    ClassId: number;
    CourseId: number;
    TeacherId: number;
    DateId: number;

    constructor(scheduleClassId: number, courseId: number, teacherId: number, dateId: number) {
        this.ClassId = scheduleClassId;
        this.CourseId = courseId;
        this.TeacherId = teacherId;
        this.DateId = dateId;
    }

}

export default ScheduleResponse;