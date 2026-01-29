class Room {
    Id: number;
    SchoolId: number;
    Name: string;
    Floor: number;
    Capacity: number;

    constructor(schoolId: number, name: string, floor: number, capacity: number) {
        this.SchoolId = schoolId;
        this.Name = name;
        this.Floor = floor;
        this.Capacity = capacity;
    }
}

export default Room;