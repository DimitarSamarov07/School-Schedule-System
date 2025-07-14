import ReturningId from "./ReturningId.js";

class BellResponse extends ReturningId {
    Name: string;
    SoundPath: string;

    constructor(id: number, name: string, soundPath: string) {
        super(id);
        this.Name = name;
        this.SoundPath = soundPath;
    }
}

export default BellResponse;