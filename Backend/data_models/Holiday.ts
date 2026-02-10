class Holiday {
    Id: number;
    Name: string;
    StartDate: string;
    EndDate: string;

    constructor(holidayId: number, name: string, startDate: string, endDate: string) {
        this.Id = holidayId;
        this.Name = name
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
}

export default Holiday;