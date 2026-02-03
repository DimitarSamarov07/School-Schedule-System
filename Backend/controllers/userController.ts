import authenticatorMaster from "../Services/auth_services.ts";
import Authenticator from "../Services/auth_services.ts";

export default class UserController {

    public static async register(req, res) {

        let {
            username, email, password, isAdmin
        } = req.body;


        if (!username || !password || !email || !isAdmin) {
            return res.status(406).send("Malformed parameters");
        }

        return await Authenticator.createNewUser(username, email, password, isAdmin)
            .then(result => {
                if (result) {
                    return res.send(result);
                }
                return res.status(404).send("User creation failed.");
            })
            .catch(err => {
                return res.status(500).send({"error": err});
            })
    }

    public static async login(req, res) {

        let {username, password} = req.body;
        if (!username || !password) {
            return res.status(406).send("Malformed parameters");
        }
        let userData = await Authenticator.getUserData(username, password);
        if (!userData) {
            return res.status(403).send({"error": "Invalid credentials."})
        }
        let token = authenticatorMaster.createJWT(userData);
        return res.cookie("AUTH_TOKEN", token).status(201).send();
    }
}
