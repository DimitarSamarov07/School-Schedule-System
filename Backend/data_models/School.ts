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

    public static convertFromDBModel(dbModel: any): School {
        let {id, name, address, workweek_config} = dbModel;

        return new School(id, name, address, workweek_config);
    }

}

export default School;