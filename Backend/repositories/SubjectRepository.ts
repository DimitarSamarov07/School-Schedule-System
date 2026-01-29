import SubjectResponse from "../response_models/SubjectResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class SubjectRepository {
    public static async getAllSubjectsForSchool(schoolId: number): Promise<SubjectResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_SUBJECTS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new SubjectResponse(row));
        });
    }

    public static async createSubject(schoolId: number, name: string, description: string): Promise<SubjectResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.INSERT_SUBJECT, [schoolId, name, description]);
            return rows.map((row: any) => new SubjectResponse(row));
        });

    }

    public static async updateSubject(id: number, name: string | null, description: string | null): Promise<SubjectResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.UPDATE_SUBJECT, [id, name, description]);
            return rows.map((row: any) => new SubjectResponse(row));
        });

    }

    public static async deleteSubject(id: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(CONSTANTS.DELETE_SUBJECT, [id]);
            return rows.affectedRows > 0;
        });

    }
}

