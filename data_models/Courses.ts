class Course {
    public id: number;
    public name: string;
    teacher: number;
    room: number;
    constructor(id: number, name: string, teacher: number, room: number) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
        this.room = room;
    }
}