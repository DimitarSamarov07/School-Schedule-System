class DateModel {
    id: number;
    date: Date;
    isWorkDay: boolean;

    constructor(id: number, date: Date, isWorkDay: boolean) {
        this.id = id;
        this.date = date;
        this.isWorkDay = isWorkDay;
    }
}