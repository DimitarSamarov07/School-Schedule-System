class Room {
    Id: number;
    Name: string;
    Floor: number;

    constructor(id: number, name: string, floor:number) {
        this.Id = id;
        this.Name = name;
        this.Floor = floor;
    }
}

export default Room;