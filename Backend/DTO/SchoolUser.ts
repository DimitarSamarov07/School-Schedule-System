export class SchoolUser {
    Id: number;
    Email: string;
    Username: string;
    IsAdmin: boolean;

    constructor(id: number,email: string, username: string, isAdmin: boolean) {
        this.Id = id;
        this.Email = email;
        this.Username = username;
        this.IsAdmin = isAdmin;
    }

    public static convertFromDBModel(dbModel: any) {
        return new SchoolUser(dbModel.userId,dbModel.email, dbModel.username, dbModel.isAdmin);
    }
}