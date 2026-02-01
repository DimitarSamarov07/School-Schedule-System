import dotenv from "dotenv";
import mariadb, {type PoolConnection} from "mariadb";

dotenv.config();
export const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    database: "school_system",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    connectionLimit: 25
});

export async function connectionPoolFactory<T>(functionToExecute: (conn: PoolConnection) => Promise<T>): Promise<T> {
    let connection: PoolConnection;
    try {
        connection = await pool.getConnection()
        return await functionToExecute(connection);
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}