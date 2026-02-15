import SubjectResponse from "../../response_models/SubjectResponse.ts";
import SubjectSql from "./queries/subject.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";

export class SubjectService {
    public static async getAllSubjectsForSchool(schoolId: number): Promise<SubjectResponse[]> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.SELECT_SUBJECTS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new SubjectResponse(row));
        });
    }

    public static async getSubjectByIdForSchool(id: number, schoolId: number) {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.SELECT_SUBJECT_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new SubjectResponse(row))[0];
        });
    }

    public static async createSubject(schoolId: number, name: string, description: string): Promise<SubjectResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.INSERT_SUBJECT, [schoolId, name, description]);
            return rows.map((row: any) => new SubjectResponse(row));
        });

    }

    public static async updateSubject(id: number, schoolId: number, name: string | null, description: string | null): Promise<SubjectResponse> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.UPDATE_SUBJECT, [name, description, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(SubjectSql.SELECT_SUBJECT_BY_ID, [id, schoolId]);
                return new SubjectResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });

    }

    public static async deleteSubject(id: number, schoolId: number): Promise<boolean> {
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.DELETE_SUBJECT, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}

