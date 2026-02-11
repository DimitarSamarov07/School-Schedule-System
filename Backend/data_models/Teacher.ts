class Teacher {
    Id: number;
    SchoolId: number;
    Name: string;
    Email: string;

    constructor(id: number, schoolId: number, name: string, email: string) {
        this.Id = id
        this.SchoolId = schoolId;
        this.Name = name;
        this.Email = email;
    }

}

export default Teacher;