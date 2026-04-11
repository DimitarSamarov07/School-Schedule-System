import authenticatorMaster from "../Services/auth_services.ts";
import Authenticator from "../Services/auth_services.ts";
import {
    AddUserToSchoolSchema,
    ChangePasswordSchema,
    CreateUserSchema,
    LoginSchema,
    RefreshSchema,
    UserPermissionSchema
} from "../Validators/AuthValidators.ts";

export default class UserController {

    public static async register(req, res) {
        const payload = CreateUserSchema.parse({...req.body, ...req.query});
        const result = await Authenticator.createNewUser(payload);

        return res.send(result);
    }

    public static async login(req, res) {
        const payload = LoginSchema.parse(req.body);
        const userData = await Authenticator.getUserData(payload);

        if (!userData) {
            return res.status(403).send({"error": "Invalid credentials."})
        }

        let token = authenticatorMaster.createJWT(userData);
        let refreshToken = await authenticatorMaster.createRefreshToken(userData)
        return res
            .cookie("AUTH_TOKEN", token)
            .cookie("REFRESH_TOKEN", refreshToken)
            .status(201).send();
    }

    public static async changePassword(req, res) {
        const payload = ChangePasswordSchema.parse(req.body);
        const changeResult = await Authenticator.changeUserPassword(payload);

        if (!changeResult) {
            return res.status(403).send({"error": "Invalid credentials."})
        }
        return res.status(200).send();
    }

    public static async refreshJwtToken(req, res) {
        const payload = RefreshSchema.parse(req.body);
        const newJwt = await Authenticator.refreshJwtAccessToken(payload)

        return res.cookie("AUTH_TOKEN", newJwt).status(201).send();
    }

    public static async logout(req, res) {
        const refreshToken = req.cookies["REFRESH_TOKEN"];
        if (refreshToken) {
            await Authenticator.revokeToken(refreshToken)
        }

        return res
            .clearCookie("AUTH_TOKEN")
            .clearCookie("REFRESH_TOKEN")
            .status(200).send();
    }

    public static async logoutEverywhere(req, res) {
        const payload = LoginSchema.parse(req.body);
        await Authenticator.revokeAllTokensForUser(payload);
        return res
            .clearCookie("AUTH_TOKEN")
            .clearCookie("REFRESH_TOKEN")
            .status(200).send();
    }

    public static async logoutUserEverywhere(req, res) {
        const payload = LoginSchema.parse(req.body);
        await Authenticator.revokeAllTokensForUser(payload, true);
        return res.status(200).send();
    }


    public static async promoteUserToAdmin(req, res) {
        const payload = UserPermissionSchema.parse({...req.query, ...req.body});
        const result = await Authenticator.promoteUserToAdmin(payload);

        return result ? res.send(result) : res.status(404).send("User promotion failed.");
    }

    public static async demoteUserFromAdmin(req, res) {
        const payload = UserPermissionSchema.parse({...req.query, ...req.body});
        const result = await Authenticator.demoteUserFromAdmin(payload);

        return result ? res.send(result) : res.status(404).send("User demotion failed.");
    }

    public static async removeUserPermissionsForSchool(req, res) {
        const payload = UserPermissionSchema.parse({...req.query, ...req.body});
        const result = await Authenticator.removeUserPermissionsForSchool(payload);

        return result ? res.send(result) : res.status(404).send("User removal failed.");
    }

    public static async addUserToSchool(req, res) {
        const payload = AddUserToSchoolSchema.parse({...req.body, ...req.query});
        const result = await Authenticator.addUserToSchool(payload);

        return result ? res.send(result) : res.status(404).send("User not found.");
    }
}
