class Time {
    Id: number;
    Start: string;
    End: string;

    constructor(timeId: number, startTime: string, endTime: string) {
        this.Start = startTime;
        this.End = endTime;
        this.Id = timeId;
    }
}

export default Time;