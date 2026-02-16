import authenticatorMaster from "../Services/auth_services.ts";
import Authenticator from "../Services/auth_services.ts";

export default class UserController {

    public static async register(req, res) {
        let {schoolId} = req.query;
        let {
            username, email, password, isAdmin
        } = req.body;

        if (!username || !password || !email || !schoolId) {
            return res.status(406).send("Malformed parameters");
        }

        return await Authenticator.createNewUser(username, password, email, schoolId, !!isAdmin)
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

    public static async logout(req, res) {
        return res.clearCookie("AUTH_TOKEN").status(200).send();
    }

    public static async promoteUserToAdmin(req, res) {
        let {schoolId} = req.query;
        let {userId} = req.body;
        if (!userId || !schoolId) {
            return res.status(406).send("Malformed parameters");
        }

        try {
            let result = await Authenticator.promoteUserToAdmin(userId, schoolId);
            return result ? res.send(result) : res.status(404).send("User promotion failed.");
        } catch (e) {
            return res.status(500).send({"error": e});
        }
    }

    public static async demoteUserFromAdmin(req, res) {
        let {schoolId} = req.query;
        let {userId} = req.body;
        if (!userId || !schoolId) {
            return res.status(406).send("Malformed parameters");
        }

        try {
            let result = await Authenticator.demoteUserFromAdmin(userId, schoolId);
            return result ? res.send(result) : res.status(404).send("User demotion failed.");
        } catch (e) {
            return res.status(500).send({"error": e});
        }
    }

    public static async removeUserPermissionsForSchool(req, res) {
        let {schoolId} = req.query;
        let {username} = req.body;
        if (!username || !schoolId) {
            return res.status(406).send("Malformed parameters");
        }

        try {
            let result = await Authenticator.removeUserPermissionsForSchool(username, schoolId);
            return result ? res.send(result) : res.status(404).send("User removal failed.");
        } catch (e) {
            return res.status(500).send({"error": e});
        }
    }

    public static async addUserToSchool(req, res) {
        let {schoolId} = req.query;
        let {username} = req.body;
        if (!username || !schoolId) {
            return res.status(406).send("Malformed parameters");
        }

        try {
            let result = await Authenticator.addUserToSchool(username, schoolId);
            return result ? res.send(result) : res.status(404).send("User not found.");
        } catch (e) {
            return res.status(500).send({"error": e});
        }
    }
}
