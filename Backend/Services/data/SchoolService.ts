import {connectionPoolFactory} from "../db_service.ts";
import SchoolSql from "./queries/school.sql.ts";
import School from "../../data_models/School.ts";
import {SchoolUser} from "../../DTO/SchoolUser.ts";
import UserSql from "./queries/user.sql.ts";

export class SchoolService {
    public static async getAllSchools(): Promise<School[]> {
        return await connectionPoolFactory<School[]>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_ALL_SCHOOLS)
            return rows.map((row: any) => School.convertFromDBModel(row));
        });
    }

    public static async getSchoolById(id: number): Promise<School> {
        return await connectionPoolFactory<School>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_SCHOOL_BY_ID, [id])
            return School.convertFromDBModel(rows[0]);
        });
    }

    public static async getSchoolWorkWeekConfigById(id: number): Promise<string> {
        return await connectionPoolFactory<string>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_SCHOOL_WORK_CONFIG_BY_ID, [id])
            let {work_week_config} = rows[0];
            return work_week_config;
        });
    }
    static async getUsersOfSchool(schoolId: number): Promise<SchoolUser[]> {
        return await connectionPoolFactory(async (conn) => {
            const userArr = await conn.query(UserSql.GET_USERS_BY_SCHOOL_ID, [schoolId]);
            return userArr.map((obj: SchoolUser) => SchoolUser.convertFromDBModel(obj));
        });
    }
}