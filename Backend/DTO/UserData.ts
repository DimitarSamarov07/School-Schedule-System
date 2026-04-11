import type SchoolMember from "../data_models/SchoolMember.ts";
import type User from "../data_models/User.ts";

export default class UserData {
    User: User;
    AccessList: SchoolMember[];
    deviceName: string;

    constructor(user: User, accessList: SchoolMember[], deviceName = "") {
        this.User = user;
        this.AccessList = accessList;
        this.deviceName = deviceName;
    }

    isAdmin() {
        if (this.User.IsSudo) {
            return true;
        }
        return !!this.AccessList?.filter(x => x.IsAdmin);
    }
}