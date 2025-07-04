class RunningTime {
    startTime: string;
    endTime: string;
    numberInSchedule: number;

    constructor(numberInSchedule: number, startTime: string, endTime: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.numberInSchedule = numberInSchedule;
    }
}

export default RunningTime;