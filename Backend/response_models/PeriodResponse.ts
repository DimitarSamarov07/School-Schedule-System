import ReturningId from "./ReturningId.js";

class Period extends ReturningId{
    Name: string;
    Start: string;
    End: string;


    constructor(data: any) {
        super(data.id);
        this.Name = data.name;
        this.Start = data.start_time;
        this.End = data.end_time;
    }
}

export default Period;