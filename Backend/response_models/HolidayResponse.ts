import ReturningId from "./ReturningId.js";

class Holiday extends ReturningId{
    Name: string;
    Start: string;
    End: string;


    constructor(data: any) {
        super(data.id);
        this.Name = data.name;
        this.Start = data.start_date;
        this.End = data.end_date;
    }
}

export default Holiday;