import Room from "./Room.js";

class Class {
    SchoolId: number;
    Name: string;
    HomeRoomId: number;
    Room: Room;

    constructor(schoolId: number, name: string, room: Room) {
        this.SchoolId = schoolId;
        this.Name = name;
        this.Room = room;
        this.HomeRoomId = room.Id;

    }
}

export default Class;