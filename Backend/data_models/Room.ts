class Room {
    Id: number;
    SchoolId: number;
    Name: string;
    Floor: number;
    Capacity: number;

    constructor(id: number, schoolId: number, name: string, floor: number, capacity: number) {
        this.Id = id;
        this.SchoolId = schoolId;
        this.Name = name;
        this.Floor = floor;
        this.Capacity = capacity;
    }
}

export default Room;