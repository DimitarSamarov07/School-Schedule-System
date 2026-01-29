class Subject {
    SchoolId: number;
    public Name: string;
    public Description: string;

    constructor(schoolId: number, name: string, description: string) {

        this.SchoolId = schoolId;
        this.Name = name;
        this.Description = description;
    }
}

export default Subject;