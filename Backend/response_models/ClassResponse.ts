import ReturningId from "./ReturningId.js";
import RoomResponse from "./RoomResponse.ts";

class ClassResponse extends ReturningId {
    Name: string;
    Description: string;
    Room: RoomResponse;
    constructor(data: any) {
        super(data.class_id);
        this.Name = data.class_name;
        this.Description = data.class_description;
        this.Room = new RoomResponse({
            id: data.room_id,
            name: data.room_name,
            floor: data.floor,
            capacity: data.capacity
        });
    }
}

export default ClassResponse;