class User {

    Username: string;
    Password: string;
    Email: string;

    constructor(username: string, email: string, password: string) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }

}

export default User;