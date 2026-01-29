import mariadb from 'mariadb';
import dotenv from 'dotenv';
import MariaDB_constants from "./mariaDB_constants.ts";

class MariaDBServices {
    static pool ;
    static initializeConnection(): void {
        dotenv.config();
        this.pool = mariadb.createPool({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
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