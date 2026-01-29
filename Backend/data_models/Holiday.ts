class Holiday {
    Id: number;
    SchoolId: number;
    Name: string;
    StartDate: string;
    EndDate: string;

    constructor(holidayId: number, schoolId: number, name: string, startDate: string, endDate: string) {
        this.Id = holidayId;
        this.SchoolId = schoolId;
        this.Name = name
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
}

export default Holiday;