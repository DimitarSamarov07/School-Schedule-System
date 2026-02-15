import ClassResponse from "../../response_models/ClassResponse.ts";
import ClassSql from "./queries/class.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";


export class ClassService {
    public static async getAllClassesForSchool(schoolId: number): Promise<ClassResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.SELECT_CLASSES_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new ClassResponse(row));
        });
    }

    public static async getClassByIdForSchool(id: number, schoolId: number): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.SELECT_CLASS_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new ClassResponse(row))[0];
        });
    }

    public static async createClass(schoolId: number, name: string, description: string | null, homeRoomId: number): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.INSERT_INTO_CLASSES, [schoolId, name, description, homeRoomId]);
            return rows.map((row: any) => new ClassResponse(row));
        });
    }

    public static async updateClass(id: number, schoolId: number, name: string | null, description: string | null, homeRoomId: number | null): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.UPDATE_CLASS, [name, description, homeRoomId, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(ClassSql.SELECT_CLASS_BY_ID, [id, schoolId]);
                return new ClassResponse(updatedEntry.rows[0]);
            }
            throw new Error("No rows affected");
        });
    }

    public static async deleteClass(id: number, schoolId: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(ClassSql.DELETE_CLASS, [id, schoolId]);
            return rows.affectedRows > 0;
        });
    }
}

