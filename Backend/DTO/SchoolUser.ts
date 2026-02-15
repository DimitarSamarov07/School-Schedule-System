export class SchoolUser {
    Email: string;
    Username: string;
    IsAdmin: boolean;

    constructor(email: string, username: string, isAdmin: boolean) {
        this.Email = email;
        this.Username = username;
        this.IsAdmin = isAdmin;
    }

    public static convertFromDBModel(dbModel: any) {
        return new SchoolUser(dbModel.email, dbModel.username, dbModel.isAdmin);
    }
}