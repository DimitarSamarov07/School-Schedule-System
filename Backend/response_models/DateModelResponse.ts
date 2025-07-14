import ReturningId from "./ReturningId.js";

class DateModelResponse extends ReturningId{
    Date: string;
    IsHoliday: boolean;

    constructor(id: number, date: string, isHoliday: boolean) {
        super(id);
        this.Date = date;
        this.IsHoliday = isHoliday;
    }
}

export default DateModelResponse;