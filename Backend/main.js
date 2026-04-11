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
import authRoutes from "./routes/authRoutes.ts";
import subjectRoutes from "./routes/subjectRoutes.ts";
import holidayRoutes from "./routes/holidayRoutes.ts";
import assetsRoutes from "./routes/assetsRoutes.ts";

// Initializing Express App
import {doubleCsrf} from "csrf-csrf";
import schoolRoutes from "./routes/schoolRoutes.ts";
import {ZodError} from "zod";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'x-csrf-token', 'Authorization'],
    credentials: true
}))

const keyGenerator = (req) => {
    // If the Refresh token is available, use it
    if (req.cookies.REFRESH_TOKEN) {
        return req.cookies.REFRESH_TOKEN;
    }

    // 2. If no token (guest), fallback to IP.
    return req.ip;
}

const standardLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: {error: "Too many requests. Try again later."},
    keyGenerator: keyGenerator
});

const utilityLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {error: "Utility rate limit exceeded. Try again later."},
    keyGenerator: keyGenerator
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
    getSessionIdentifier: (req) => req.cookies.REFRESH_TOKEN || "guest",
});

export const globalErrorHandler = (
    err,
    req,
    res,
    next
) => {
    // Catch Zod Validation Errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation Error",
            errorType: "validation",
            details: err.issues.map(e => ({
                path: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({errorType: "sql", error: "Duplicate entry detected."});
    }

    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
            error: "Invalid or missing CSRF token",
            errorType: "security",
            message: "The request was rejected for security reasons. Please refresh your CSRF token."
        });
    }

    // Custom Application Errors
    if (err.message && err.message.includes("Security Violation")) {
        return res.status(403).json({errorType: "security", error: err.message});
    }

    // Catch All Other Server Errors
    console.error("[Unhandled Error]:", err);
    return res.status(500).json({
        error: "Internal Server Error",
        errorType: "other",
        // Raw error messages will only be sent in development, not in production.
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};


//app.use(limiter)
app.use(cookieParser())
app.use(express.json({limit: '10kb'}));
app.use(doubleCsrfProtection);
app.use(helmet()) // Enhances security


const apiRouter = express.Router();

// Guarded by individual limiters, see the route
apiRouter.use("/auth", authRoutes);

// Utility limiter
apiRouter.use("/assets", utilityLimiter, assetsRoutes)
app.get("/csrf-token", utilityLimiter, (req, res) => {
    const token = generateCsrfToken(req, res);
    return res.json({csrfToken: token});
});

// Standard limit for most routes
apiRouter.use("/school", standardLimiter, schoolRoutes);
apiRouter.use("/class", standardLimiter, classRoutes);
apiRouter.use("/holiday", standardLimiter, holidayRoutes);
apiRouter.use("/period", standardLimiter, periodRoutes);
apiRouter.use("/room", standardLimiter, roomRoutes);
apiRouter.use("/subject", standardLimiter, subjectRoutes);
apiRouter.use("/schedule", standardLimiter, scheduleRoutes);
apiRouter.use("/teacher", standardLimiter, teacherRoutes);
apiRouter.use("/user", standardLimiter, userRoutes);

app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.status(404).json({error: "Page not found"});
});

app.use(globalErrorHandler);

let port = 1343;

await authenticatorMaster.initializeAuthenticator();
app.listen(port, () => console.log(`App Listening on port ${port}`));