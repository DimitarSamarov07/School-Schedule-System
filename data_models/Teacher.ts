class Teacher {
    id: number;
    firstName: string;
    lastName: string;

    constructor(teacherId: number, firstName: string, lastName: string) {
        this.id = teacherId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

}

export default Teacher;