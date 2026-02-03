import type SchoolMember from "../data_models/SchoolMember.ts";
import type User from "../data_models/User.ts";

export default class UserData {
    User: User;
    AccessList: SchoolMember[]

    constructor(user: User, accessList: SchoolMember[]) {
        this.User = user;
        this.AccessList = accessList;
    }
}