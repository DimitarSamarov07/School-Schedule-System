class Subject {
    public Id: number;
    public SchoolId: number;
    public Name: string;
    public Description: string;

    constructor(id: number, schoolId: number, name: string, description: string) {
        this.Id = id;
        this.SchoolId = schoolId;
        this.Name = name;
        this.Description = description;
    }
}

export default Subject;