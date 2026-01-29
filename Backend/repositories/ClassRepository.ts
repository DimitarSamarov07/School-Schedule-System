import ClassResponse from "../response_models/ClassResponse.ts";
import CONSTANTS from "../MariaDBConstants.ts";
import {connectionPoolFactory} from "../DBConfig.ts";


export class ClassRepository {
    public static async getAllClassesForSchool(schoolId: number): Promise<ClassResponse[]> {
        return await connectionPoolFactory( async (conn) => {
            const rows = await conn.query(CONSTANTS.SELECT_CLASSES_BY_SCHOOL, [schoolId]);
            return rows.map((row: any) => new ClassResponse(row));
        });

    }
}

