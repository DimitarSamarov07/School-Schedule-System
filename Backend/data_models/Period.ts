class Period {
    Id: number;
    SchoolId: number;
    Name: string;
    Start: string;
    End: string;

    constructor(periodID: number,schoolId: number, name: string, startTime: string, endTime: string) {
        this.Id = periodID;
        this.SchoolId = schoolId;
        this.Name = name;
        this.Start = startTime;
        this.End = endTime;
    }
}

export default Period;