import {env} from "node:process";
import {promises as fs} from 'fs';
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'

class Authenticator {

    private static secretKey: string;

    static async initializeAuthenticator() {
        let secretLocation = env.JWT_SECRET_PK_LOCATION;
        this.secretKey = await fs.readFile(secretLocation, 'utf-8');
    }

    static initializeJWT(username: string): void {
        return jwt.sign({username: username}, this.secretKey, {algorithm: 'RS256'});
    }

}

export default Authenticator;