class Room {
    id: number;
    name: string;
    floor: number;

    constructor(id: number, name: string, floor:number) {
        this.id = id;
        this.name = name;
        this.floor = floor;
    }
}

export default Room;