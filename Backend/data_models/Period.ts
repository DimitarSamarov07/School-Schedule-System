class Period {
    Id: number;
    SchoolId: number;
    Name: string;
    Start: string;
    End: string;

    constructor(schoolId: number, name: string, startTime: string, endTime: string) {

        this.SchoolId = schoolId;
        this.Name = name;
        this.Start = startTime;
        this.End = endTime;
    }
}

export default Period;