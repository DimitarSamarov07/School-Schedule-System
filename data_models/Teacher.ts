class Teacher {
    Id: number;
    FirstName: string;
    LastName: string;

    constructor(teacherId: number, firstName: string, lastName: string) {
        this.Id = teacherId;
        this.FirstName = firstName;
        this.LastName = lastName;
    }

}

export default Teacher;