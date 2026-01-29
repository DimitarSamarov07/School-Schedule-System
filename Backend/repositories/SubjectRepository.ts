import SubjectResponse from "../response_models/SubjectResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class SubjectRepository {
    public static async getAllSubjectsForSchool(schoolId: number): Promise<SubjectResponse[]> {
        return await connectionPoolFactory( async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_SUBJECTS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new SubjectResponse(row));
        });
    }
}

