import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import authenticatorMaster from "./Services/auth_services.ts";
import cookieParser from "cookie-parser";

// Initializing Express App

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
});

//app.use(limiter)
app.use(cookieParser())
app.use(express.json({limit: '10kb'}));
//app.use(lusca.csrf());
app.use(helmet()) // Enhances security


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

//
app.set('trust proxy', 1);

let port = 1343;

async function checkUserAuthenticationMiddleware(req, res, next) {
    let {AUTHENTICATION_ADMIN_TOKEN} = req.cookies;
    if (AUTHENTICATION_ADMIN_TOKEN) {
        let decoded = await authenticatorMaster.decodeJWT(AUTHENTICATION_ADMIN_TOKEN);
        if (!decoded) {
            return res.status(401).send("Authentication failure.")
        } else {
            req.username = decoded.username;
            next();
        }

    }
    return res.status(401).send("Authentication failure.")
}

app.post("/register", async (req, res) => {

    let {username, email, password} = req.body;
    if (!username || !password || !email) {
        return res.status(406).send("Malformed parameters");
    }

    return await schoolManager.registerNewAdmin(username, email, password)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.status(500).send({"error": err});
        })
});
app.post("/login", async (req, res) => {

    let {username, password} = req.body;
    if (!username || !password) {
        return res.status(406).send("Malformed parameters");
    }
    let isAdmin = await schoolManager.checkAdminCredentials(username, password);
    if (!isAdmin) {
        return res.status(403).send({"error": "Invalid credentials."})
    }
    let token = authenticatorMaster.createJWT(username);
    return res.cookie("AUTH_TOKEN", token).status(201).send();
});

//await authenticatorMaster.initializeAuthenticator();
app.listen(port, () => console.log(`App Listening on port ${port}`));