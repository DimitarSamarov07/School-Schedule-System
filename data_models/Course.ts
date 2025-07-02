import Teacher from "./Teacher";
import Room from "./Room";

class Course {
    public id: number;
    public name: string;
    teacher: Teacher;
    room: Room;

    constructor(id: number, name: string, teacher: Teacher, room: Room) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
        this.room = room;
    }
}

export default Course;