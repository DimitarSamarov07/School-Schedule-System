import Teacher from "./Teacher.ts";
import Room from "./Room.ts";

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