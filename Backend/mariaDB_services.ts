import mariadb, {type Pool} from 'mariadb';
import dotenv from 'dotenv';
import MariaDB_constants from "./mariaDB_constants.ts";

class MariaDBServices {
    static pool: Pool;

    static initializeConnection(): void {
        dotenv.config();
        this.pool = mariadb.createPool({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            connectionLimit: 5,
            trace: true
        });
    }

    static async getAllRooms(){
        await this.pool.query(
            MariaDB_constants.SELECT_ROOMS_BY_SCHOOL, [1]
        ).then(res => console.log(res));
    }
}

export default MariaDBServices;