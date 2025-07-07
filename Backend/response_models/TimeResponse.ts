import ReturningId from "./ReturningId.js";

class Time extends ReturningId{
    Start: string;
    End: string;

    constructor(timeId: number, startTime: string, endTime: string) {
        super(timeId);
        this.Start = startTime;
        this.End = endTime;
    }
}

export default Time;