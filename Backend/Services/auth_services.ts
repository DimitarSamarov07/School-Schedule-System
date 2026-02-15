import {env} from "node:process";
import {promises as fs} from 'fs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import bcrypt from "bcrypt";
import {connectionPoolFactory} from "./db_service.ts";
import UserSql from "./data/queries/user.sql.ts";
import SchoolMember from "../data_models/SchoolMember.ts";
import User from "../data_models/User.ts";
import UserData from "../DTO/UserData.ts";
import {SchoolService} from "./data/SchoolService.ts";
import {SchoolUser} from "../DTO/SchoolUser.ts";


class Authenticator {

    private static secretKey: string;
    static saltRounds = 10;

    static async initializeAuthenticator(): Promise<void> {
        let jwtSecretLocation = env.JWT_SECRET_PK_LOCATION;
        if (!jwtSecretLocation) {
            jwtSecretLocation = './private.key';
        }
        this.secretKey = await fs.readFile(jwtSecretLocation, 'utf-8');
    }

    static async retrieveCSRFKey(): Promise<string> {
        let csrfSecretLocation = env.CSRF_SECRET_PK_LOCATION;
        if (!csrfSecretLocation) {
            csrfSecretLocation = './csrf.key';
        }
        return await fs.readFile(csrfSecretLocation, 'utf-8');
    }

    static createJWT(userData: UserData): string {
        return jwt.sign({
            username: userData.User.Username,
            email: userData.User.Email,
            isSudo: userData.User.IsSudo,
            accessList: userData.AccessList
        }, this.secretKey, {algorithm: 'RS256'});
    }

    static decodeJWT(token: string): {
        username: string,
        email: string,
        isSudo: boolean,
        accessList: SchoolMember[]
    } | null {
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.secretKey, {
                algorithms: ['RS256']
            });
            return decodedToken;
        } catch (e) {
            return null;
        }
    }

    static async getUserData(username: string, plainPassword: string): Promise<UserData | null> {
        return await connectionPoolFactory(async (conn): Promise<UserData | null> => {
            const userEntries = await conn.query(UserSql.GET_USER_BY_USERNAME, [username]);

            if (userEntries.length > 0) {
                const user = User.convertFromDbModel(userEntries[0]);
                let passwordMatch = await this.hashPasswordCompare(plainPassword, user.Password);
                if (passwordMatch) {
                    if (user.IsSudo) {
                        let sudoList: SchoolMember[] = []
                        const allSchools = await SchoolService.getAllSchools();
                        for (let school of allSchools) {
                            let member = new SchoolMember(school.Id, user.Id, true);
                            sudoList.push(member);
                        }
                        return new UserData(user, sudoList);
                    }
                    const userAccessDbObjArr = await conn.query(UserSql.GET_USER_PERMISSIONS, [user.Id]);
                    const userAccessArr = userAccessDbObjArr.map((obj) => SchoolMember.convertFromDBModel(obj))
                    return new UserData(user, userAccessArr);
                }
            }
            return null;
        });
    }

    static async createNewUser(username: string, plainPassword: string, email: string, schoolId: number, isAdmin: boolean = false) {
        return await connectionPoolFactory(async (conn) => {
            let hashedPassword = await this.hashPassword(plainPassword);

            let [userObj] = await conn.query(UserSql.CREATE_USER, [username, email, hashedPassword])
            if (userObj) {
                let {affectedRows: userAccessAffectedRows} = await conn.query(UserSql.CREATE_USER_PERMISSION, [userObj.id, schoolId, isAdmin])
                if (userAccessAffectedRows > 0) {
                    return true;
                }
            }
            return false;
        })
    }

    static async getUsersOfSchool(schoolId: number): Promise<SchoolUser[]> {
        return await connectionPoolFactory(async (conn) => {
            const userArr = await conn.query(UserSql.GET_USERS_BY_SCHOOL_ID, [schoolId]);
            return userArr.map((obj) => SchoolUser.convertFromDBModel(obj));
        });
    }

    static async addUserToSchool(schoolId: number, username: number) {
        return await connectionPoolFactory(async (conn) => {
            let userId = (await conn.query(UserSql.GET_USER_BY_USERNAME, [username]))[0]?.id;
            if (userId) {
                let {affectedRows: userAccessAffectedRows} = await conn.query(UserSql.CREATE_USER_PERMISSION, [userId, schoolId, false])
                if (userAccessAffectedRows > 0) {
                    return true;
                }
                throw new Error("No rows affected");
            }
            return false;
        })
    }

    static async promoteUserToAdmin(userId: number, schoolId: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            let {affectedRows: userAccessAffectedRows} = await conn.query(UserSql.UPDATE_USER_PERMISSION, [userId, schoolId, true])
            if (userAccessAffectedRows > 0) {
                return true;
            }
            throw new Error("No rows affected");
        })
    }

    static async demoteUserFromAdmin(userId: number, schoolId: number) {
        return await connectionPoolFactory(async (conn) => {
            let {affectedRows: userAccessAffectedRows} = await conn.query(UserSql.UPDATE_USER_PERMISSION, [userId, schoolId, false])
            if (userAccessAffectedRows > 0) {
                return true;
            }
            throw new Error("No rows affected");
        })
    }

    static async removeUserPermissionsForSchool(userId: number, schoolId: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            let {affectedRows: userAccessAffectedRows} = await conn.query(UserSql.DELETE_USER_PERMISSIONS_FOR_SCHOOL, [userId, schoolId])
            return userAccessAffectedRows > 0;
        })
    }

    public static async hashPasswordCompare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

}

export default Authenticator;