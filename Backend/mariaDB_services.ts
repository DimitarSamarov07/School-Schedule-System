import mariadb, {type Pool, type PoolConnection} from 'mariadb';
import dotenv from 'dotenv';
import CONSTANTS from "./mariaDB_constants.ts";

class MariaDBServices {
    static pool: Pool;

    static initializeConnection(): void {
        dotenv.config();
        this.pool = mariadb.createPool({
            host: process.env.DATABASE_HOST,
            database: "school_system",
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            connectionLimit: 25,
            trace: true
        });
    }

    static async getAllRoomsForSchool(schoolId: number) {
        return await this.connectionPoolFactory(this.pool, async (conn) => {
            return await conn.query(CONSTANTS.SELECT_ROOMS_BY_SCHOOL, [schoolId]);
        })
    }

    private static async connectionPoolFactory(pool: Pool, functionToExecute: (conn: PoolConnection) => any) {
        let connection: PoolConnection;
        let result: any;
        try {
            connection = await pool.getConnection()
            result = await functionToExecute(connection);
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
        return result;
    }
}

export default MariaDBServices;