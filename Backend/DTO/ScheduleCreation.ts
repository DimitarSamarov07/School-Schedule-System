export class ScheduleCreation {
    periodId: number;
    classId: number;
    teacherId: number;
    subjectId: number;
    roomId: number;

    constructor(periodId: number, classId: number, teacherId: number, subjectId: number, roomId: number) {
        this.periodId = periodId;
        this.classId = classId;
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.roomId = roomId;
    }
}