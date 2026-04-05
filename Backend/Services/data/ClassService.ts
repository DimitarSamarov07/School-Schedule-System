import ClassResponse from "../../response_models/ClassResponse.ts";
import ClassSql from "./queries/class.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";
import type {ClassIdPayload, CreateClassPayload, UpdateClassPayload} from "../../Validators/ClassValidators.ts";


export class ClassService {
    public static async getAllClassesForSchool(data: SchoolIdPayload): Promise<ClassResponse[]> {
        const {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.SELECT_CLASSES_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new ClassResponse(row));
        });
    }

    public static async getClassByIdForSchool(data: ClassIdPayload): Promise<ClassResponse> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.SELECT_CLASS_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new ClassResponse(row))[0];
        });
    }

    public static async createClass(data: CreateClassPayload): Promise<ClassResponse> {
        const {schoolId, name, description, homeRoomId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.INSERT_INTO_CLASSES, [schoolId, name, description, homeRoomId]);
            return rows.map((row: any) => new ClassResponse(row));
        });
    }

    public static async updateClass(data: UpdateClassPayload): Promise<ClassResponse> {
        const {id, schoolId, name, description, homeRoomId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.UPDATE_CLASS, [name, description, homeRoomId, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(ClassSql.SELECT_CLASS_BY_ID, [id, schoolId]);
                return new ClassResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });
    }

    public static async deleteClass(data: ClassIdPayload): Promise<boolean> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.DELETE_CLASS, [id, schoolId]);
            return rows.affectedRows > 0;
        });
    }
}

