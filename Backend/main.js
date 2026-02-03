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

//await authenticatorMaster.initializeAuthenticator();
app.listen(port, () => console.log(`App Listening on port ${port}`));