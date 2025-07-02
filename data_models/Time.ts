class Time {
    id: number;
    startTime: Date;
    endTime: Date;

    constructor(timeId: number, startTime: string, endTime: string) {
        let dateStart = new Date();
        let dateEnd = new Date();

        this.id = timeId;

        //Split the received string and set it as the start time
        let splitStart = startTime.split(":")
        dateStart.setHours(parseInt(splitStart[0]), parseInt(splitStart[1]))
        this.startTime = dateStart;

        //Split the received string and set it as the end time
        let splitEnd = endTime.split(":")
        dateEnd.setHours(parseInt(splitEnd[0], parseInt(splitEnd[1])))
        this.endTime = dateEnd;

    }
}

export default Time;