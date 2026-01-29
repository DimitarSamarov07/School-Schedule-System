import TeacherResponse from "../response_models/TeacherResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class TeacherRepository {
    public static async getAllTeachersForSchool(schoolId: number): Promise<TeacherResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_TEACHERS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new TeacherResponse(row));
        });
    }

    public static async createTeacher(schoolId: number, name: string, email: string): Promise<TeacherResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.INSERT_INTO_TEACHERS, [schoolId, name, email]);
            return rows.map((row: any) => new TeacherResponse(row));
        });

    }

    public static async updateTeacher(id: number, name: string | null, email: string | null): Promise<TeacherResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.UPDATE_TEACHER, [id, name, email]);
            return rows.map((row: any) => new TeacherResponse(row));
        });

    }

    public static async deleteTeacher(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.DELETE_TEACHER, [id]);
            return rows.affectedRows > 0;
        });

    }
}

