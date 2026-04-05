import {connectionPoolFactory} from "../db_service.ts";
import SchoolSql from "./queries/school.sql.ts";
import School from "../../data_models/School.ts";
import {SchoolUser} from "../../DTO/SchoolUser.ts";
import UserSql from "./queries/user.sql.ts";
import type {CreateSchoolPayload, SchoolIdPayload, UpdateSchoolPayload} from "../../Validators/SchoolValidators.ts";

export class SchoolService {
    public static async getAllSchools(): Promise<School[]> {
        return await connectionPoolFactory<School[]>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_ALL_SCHOOLS)
            return rows.map((row: any) => School.convertFromDBModel(row));
        });
    }

    public static async getSchoolById(data: SchoolIdPayload): Promise<School> {
        let {schoolId} = data;
        return await connectionPoolFactory<School>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_SCHOOL_BY_ID, [schoolId])
            return School.convertFromDBModel(rows[0]);
        });
    }

    public static async createSchool(data: CreateSchoolPayload): Promise<School> {
        const {name, address, workWeekConfig} = data;
        return await connectionPoolFactory<School>(async (conn) => {
            const rows = await conn.query(SchoolSql.INSERT_INTO_SCHOOLS, [name, address, workWeekConfig])
            return rows[0];
        });
    }

    public static async updateSchoolById(data: UpdateSchoolPayload): Promise<School> {
        const {schoolId, name, address, workWeekConfig} = data;
        return await connectionPoolFactory<School>(async (conn) => {
            const rows = await conn.query(SchoolSql.UPDATE_SCHOOL, [name, address, workWeekConfig])
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(SchoolSql.SELECT_SCHOOL_BY_ID, [schoolId])
                return School.convertFromDBModel(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });
    }

    public static async getSchoolWorkWeekConfigById(data: SchoolIdPayload): Promise<number[]> {
        const {schoolId} = data;
        return await connectionPoolFactory<number[]>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_SCHOOL_WORK_CONFIG_BY_ID, [schoolId])
            let {work_week_config} = rows[0];
            return work_week_config;
        });
    }

    static async getUsersOfSchool(data: SchoolIdPayload): Promise<SchoolUser[]> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const userArr = await conn.query(UserSql.GET_USERS_BY_SCHOOL_ID, [schoolId]);
            return userArr.map((obj: SchoolUser) => SchoolUser.convertFromDBModel(obj));
        });
    }
}