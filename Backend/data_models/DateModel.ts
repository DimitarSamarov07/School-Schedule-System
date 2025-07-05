class DateModel {
    Id: number;
    Date: Date;
    IsHoliday: boolean;

    constructor(id: number, date: Date, isHoliday: boolean) {
        this.Id = id;
        this.Date = date;
        this.IsHoliday = isHoliday;
    }
}

export default DateModel;