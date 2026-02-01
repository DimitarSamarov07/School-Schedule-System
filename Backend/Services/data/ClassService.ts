import ClassResponse from "../../response_models/ClassResponse.ts";
import CONSTANTS from "../../MariaDBConstants.ts";
import {connectionPoolFactory} from "../db_service.ts";


export class ClassService {
    public static async getAllClassesForSchool(schoolId: number): Promise<ClassResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_CLASSES_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new ClassResponse(row));
        });

    }

    public static async createClass(schoolId: number, name: string, homeRoomId: number): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.INSERT_INTO_CLASSES, [schoolId, name, homeRoomId]);
            return rows.map((row: any) => new ClassResponse(row));
        });

    }

    public static async updateClass(id: number, name: string | null, homeRoomId: number | null): Promise<ClassResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.UPDATE_CLASS, [id, name, homeRoomId]);
            return rows.map((row: any) => new ClassResponse(row));
        });

    }

    public static async deleteClass(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.DELETE_CLASS, [id]);
            return rows.affectedRows > 0;
        });

    }
}

