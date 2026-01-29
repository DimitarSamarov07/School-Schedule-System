import TeacherResponse from "../response_models/TeacherResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";

export class TeacherRepository {
    public static async getAllTeachersForSchool(schoolId: number): Promise<TeacherResponse[]> {
        return await connectionPoolFactory( async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_TEACHERS_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new TeacherResponse(row));
        });
    }
}

