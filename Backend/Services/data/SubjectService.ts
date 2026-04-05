import SubjectResponse from "../../response_models/SubjectResponse.ts";
import SubjectSql from "./queries/subject.sql.ts";
import {connectionPoolFactory} from "../db_service.ts";
import type {SchoolIdPayload} from "../../Validators/SchoolValidators.ts";
import type {CreateSubjectPayload, SubjectIdPayload, UpdateSubjectPayload} from "../../Validators/SubjectValidators.ts";

export class SubjectService {
    public static async getAllSubjectsForSchool(data: SchoolIdPayload): Promise<SubjectResponse[]> {
        let {schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.SELECT_SUBJECTS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new SubjectResponse(row));
        });
    }

    public static async getSubjectByIdForSchool(data: SubjectIdPayload): Promise<SubjectResponse> {
        let {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.SELECT_SUBJECT_BY_ID, [id, schoolId]);
            return rows.map((row: any) => new SubjectResponse(row))[0];
        });
    }

    public static async createSubject(data: CreateSubjectPayload): Promise<SubjectResponse> {
        const {schoolId, name, description} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.INSERT_SUBJECT, [schoolId, name, description]);
            return rows.map((row: any) => new SubjectResponse(row));
        });

    }

    public static async updateSubject(data: UpdateSubjectPayload): Promise<SubjectResponse> {
        const {name, description, id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.UPDATE_SUBJECT, [name, description, id, schoolId]);
            if (rows.affectedRows > 0) {
                let updatedEntry = await conn.query(SubjectSql.SELECT_SUBJECT_BY_ID, [id, schoolId]);
                return new SubjectResponse(updatedEntry[0]);
            }
            throw new Error("No rows affected");
        });

    }

    public static async deleteSubject(data: SubjectIdPayload): Promise<boolean> {
        const {id, schoolId} = data;
        return await connectionPoolFactory(async (conn) => {
            const rows = await conn.query(SubjectSql.DELETE_SUBJECT, [id, schoolId]);
            return rows.affectedRows > 0;
        });

    }
}

