import Teacher from "./Teacher.ts";
import Room from "./Room.ts";

class Course {
    public Id: number;
    public Name: string;
    Teacher: Teacher;
    Room: Room;

    constructor(id: number, name: string, teacher: Teacher, room: Room) {
        this.Id = id;
        this.Name = name;
        this.Teacher = teacher;
        this.Room = room;
    }
}

export default Course;