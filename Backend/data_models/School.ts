class School {
    Id: number;
    Name: string;
    Address: string;
    WorkweekConfig?: number[];

    constructor(schoolId: number, name: string, address: string, workweekConfig?: number[]) {
        this.Id = schoolId;
        this.Name = name;
        this.Address = address;
        this.WorkweekConfig = workweekConfig;
    }

}

export default School;