class RunningTime {
    label: string;
    startTime: string;
    endTime: string;


    constructor(label: string, startTime: string, endTime: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.label = label;
    }
}

export default RunningTime;