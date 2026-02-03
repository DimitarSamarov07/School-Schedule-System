class SchoolMember {
    SchoolId: number;
    UserId: number;
    IsAdmin: boolean;

    constructor(schoolId: number, userId: number, isAdmin: boolean) {
        this.SchoolId = schoolId;
        this.UserId = userId;
        this.IsAdmin = isAdmin;
    }

    public static convertFromDBModel(dbModel: any) {
        let {school_id, user_id, is_admin} = dbModel;
        return new SchoolMember(school_id, user_id, is_admin);
    }
}

export default SchoolMember;