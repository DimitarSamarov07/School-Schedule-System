import ReturningId from "./ReturningId.js";

class RoomResponse extends ReturningId{
    Id: number;
    Name: string;
    Floor: number;
    Capacity: number;

    constructor(data: any) {
        super(data.id);
        this.Name = data.name;
        this.Floor = data.floor;
        this.Capacity = data.capacity;
    }
}

export default RoomResponse;