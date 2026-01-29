class SchoolMember {
    SchoolId: number;
    UserId: number;
    IsAdmin: boolean;

    constructor(schoolId: number, userId: number, isAdmin: boolean) {
        this.SchoolId = schoolId;
        this.UserId = userId;
        this.IsAdmin = isAdmin;
    }

}

export default SchoolMember;