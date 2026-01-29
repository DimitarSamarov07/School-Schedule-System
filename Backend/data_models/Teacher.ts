class Teacher {
    SchoolId: number;
    Name: string;
    Email: string;

    constructor(schoolId: number, name: string, email: string) {
        this.SchoolId = schoolId;
        this.Name = name;
        this.Email = email;
    }

}

export default Teacher;