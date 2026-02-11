import Room from "./Room.js";

class Class {
    Id: number;
    SchoolId: number;
    Name: string;
    Description: string;
    HomeRoomId: number;
    Room: Room;

    constructor(id: number, schoolId: number, name: string, description: string, room: Room) {
        this.Id = id;
        this.SchoolId = schoolId;
        this.Name = name;
        this.Room = room;
        this.HomeRoomId = room.Id;
    }
}

export default Class;