import ReturningId from "./ReturningId.js";

class RoomResponse extends ReturningId{
    Id: number;
    Name: string;
    Floor: number;

    constructor(id: number, name: string, floor:number) {
        super(id);
        this.Name = name;
        this.Floor = floor;
    }
}

export default RoomResponse;