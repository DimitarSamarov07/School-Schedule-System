import ReturningId from "./ReturningId.js";

class TeacherResponse extends ReturningId{
    Name: string;
    Email: string;

    constructor(data) {
        super(data.teacherId);
        this.Name = data.name;
        this.Email = data.email;
    }

}

export default TeacherResponse;