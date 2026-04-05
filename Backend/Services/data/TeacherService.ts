import TeacherResponse from "../../response_models/TeacherResponse.ts";
import TeacherSql from "./queries/teacher.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";
import type {CreateTeacherPayload, TeacherIdPayload, UpdateTeacherPayload} from "../../Validators/TeacherValidators.ts";

export class TeacherService {
    public static async getAllTeachersForSchool(data: SchoolIdPayload): Promise<TeacherResponse[]> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(TeacherSql.SELECT_TEACHERS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new TeacherResponse(row));
        });
    }

    public static async getTeacherByIdForSchool(data: TeacherIdPayload): Promise<TeacherResponse> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(TeacherSql.SELECT_TEACHER_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new TeacherResponse(row));
        });
    }

    public static async createTeacher(data: CreateTeacherPayload): Promise<TeacherResponse> {
        const {schoolId, name, email} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(TeacherSql.INSERT_INTO_TEACHERS, [schoolId, name, email]);
            return rows.map((row: any) => new TeacherResponse(row));
        });

    }

    public static async updateTeacher(data: UpdateTeacherPayload): Promise<TeacherResponse> {
        const {id, schoolId, name, email} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(TeacherSql.UPDATE_TEACHER, [name, email, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(TeacherSql.SELECT_TEACHER_BY_ID, [id, schoolId]);
                return new TeacherResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });

    }

    public static async deleteTeacher(data: TeacherIdPayload): Promise<boolean> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(TeacherSql.DELETE_TEACHER, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}

