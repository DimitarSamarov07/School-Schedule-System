import ReturningId from "./ReturningId.js";

class SubjectResponse extends ReturningId{
    public Name: string;
    Description: string;

    constructor(data: any) {
        super(data.id);
        this.Name = data.name;
        this.Description = data.description;
    }
}

export default SubjectResponse;