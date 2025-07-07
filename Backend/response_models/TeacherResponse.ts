import ReturningId from "./ReturningId.js";

class TeacherResponse extends ReturningId{
    FirstName: string;
    LastName: string;

    constructor(teacherId: number, firstName: string, lastName: string) {
        super(teacherId);
        this.FirstName = firstName;
        this.LastName = lastName;
    }

}

export default TeacherResponse;