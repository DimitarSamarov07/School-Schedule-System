class User {
    Id: number;
    Username: string;
    Password: string;
    Email: string;

    constructor(id: number, username: string, email: string, password: string) {
        this.Id = id;
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }

    static convertFromDbModel(dbModel: any): User {
        let {id, username, password_hash, email} = dbModel;
        return new User(id, username, email, password_hash);
    }

}

export default User;