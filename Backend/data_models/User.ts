class User {
    Id: number;
    Username: string;
    Password: string;
    Email: string;
    IsSudo: boolean;

    constructor(id: number, username: string, email: string, password: string, isSudo: boolean) {
        this.Id = id;
        this.Username = username;
        this.Password = password;
        this.Email = email;
        this.IsSudo = isSudo;
    }

    static convertFromDbModel(dbModel: any): User {
        let {id, username, password_hash, email, is_sudo} = dbModel;
        return new User(id, username, email, password_hash, is_sudo);
    }

}

export default User;