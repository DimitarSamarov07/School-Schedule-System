import {connectionPoolFactory} from "../db_service.ts";
import SchoolSql from "./queries/school.sql.ts";
import School from "../../data_models/School.ts";

export class SchoolService {
    public static async getAllSchools(): Promise<School[]> {
        return await connectionPoolFactory<School[]>(async (conn) => {
            const rows = await conn.query(SchoolSql.SELECT_ALL_SCHOOLS)
            return rows.map((row: any) => School.convertFromDBModel(row));
        });
    }
}