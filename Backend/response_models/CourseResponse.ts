import ReturningId from "./ReturningId.js";

class CourseResponse extends ReturningId{
    public Name: string;
    TeacherId: number;
    RoomId: number;

    constructor(id: number, name: string, teacherId: number, roomId: number) {
        super(id);
        this.Name = name;
        this.TeacherId = teacherId;
        this.RoomId = roomId;
    }
}

export default CourseResponse;