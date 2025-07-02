class Schedule {
    schedule_course: number;
    schedule_class: number;
    T_id: number;
    D_id: number;

    constructor(schedule_course: number, schedule_class: number, T_id: number, D_id: number) {
        this.schedule_course = schedule_course;
        this.schedule_class = schedule_class;
        this.T_id = T_id;
        this.D_id = D_id;
    }
}