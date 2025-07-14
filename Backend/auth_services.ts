import {env} from "node:process";
import {promises as fs} from 'fs';
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'

class Authenticator {

    private static secretKey: string;

    static async initializeAuthenticator(): Promise<void> {
        let secretLocation = env.JWT_SECRET_PK_LOCATION;
        this.secretKey = await fs.readFile(secretLocation, 'utf-8');
    }

    static createJWT(username: string): string {
        return jwt.sign({username: username}, this.secretKey, {algorithm: 'RS256'});
    }

    static async decodeJWT(token: string): Promise<any> {
        let decodedToken;
        try {
            decodedToken = await jwt.verify(token, this.secretKey, {
                algorithms: ['RS256']
            });
            return decodedToken;
        }
        catch (e) {
            return null;
        }
    }

}

export default Authenticator;