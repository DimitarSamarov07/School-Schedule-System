import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import authenticatorMaster from "./Services/auth_services.ts";
import cookieParser from "cookie-parser";
import classRoutes from "./routes/classRoutes.ts";
import periodRoutes from "./routes/periodRoutes.ts";
import roomRoutes from "./routes/roomRoutes.ts";
import scheduleRoutes from "./routes/scheduleRoutes.ts";
import teacherRoutes from "./routes/teacherRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import subjectRoutes from "./routes/subjectRoutes.ts";
import holidayRoutes from "./routes/holidayRoutes.ts";

// Initializing Express App
import {doubleCsrf} from "csrf-csrf";

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'x-csrf-token', 'Authorization'],
    credentials: true
}))
const limiter = rateLimit({
    windowMs: 15 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
});
const csrfSecret = await authenticatorMaster.retrieveCSRFKey();

const {
    doubleCsrfProtection,
    generateCsrfToken
} = doubleCsrf({
    getSecret: () => csrfSecret,
    cookieName: "x-csrf-token", // This is the name of the cookie stored in the browser
    cookieOptions: {
        sameSite: "lax",
        path: "/",
        secure: false, // Set to true only in production (HTTPS)
    },
    getSessionIdentifier: (req) => req.cookies.AUTH_TOKEN || "guest",
});



//app.use(limiter)
app.use(cookieParser())
app.use(express.json({limit: '10kb'}));
app.use(doubleCsrfProtection);
app.use(helmet()) // Enhances security


app.set('trust proxy', 1);

app.get("/csrf-token", (req, res) => {
    const token = generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
});


// Include user-defined routes
app.use("/class", classRoutes);
app.use("/holiday", holidayRoutes);
app.use("/period", periodRoutes);
app.use("/room", roomRoutes);
app.use("/subject", subjectRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/teacher", teacherRoutes);
app.use("/user", userRoutes);

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

await authenticatorMaster.initializeAuthenticator();
app.listen(port, () => console.log(`App Listening on port ${port}`));