import ReturningId from "./ReturningId.js";

class ClassResponse extends ReturningId {
    Name: string;
    Description: string;

    constructor(id: number, name: string, description: string) {
        super(id);
        this.Name = name;
        this.Description = description;
    }
}

export default ClassResponse;