class DateModel {
    id: number;
    date: Date;
    isHoliday: boolean;

    constructor(id: number, date: Date, isHoliday: boolean) {
        this.id = id;
        this.date = date;
        this.isHoliday = isHoliday;
    }
}