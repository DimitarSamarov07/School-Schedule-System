import express from 'express';
import UserController from "../controllers/userController.ts";
import rateLimit from "express-rate-limit";

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {error: "Too many accounts created from this IP. Please try again later."}
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {error: "Too many login attempts. Please try again later."}
});

const refreshLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {error: "Too many refresh attempts. Please slow down and try again later."},
    keyGenerator: (req) => {
        return req.cookies.REFRESH_TOKEN || req.ip;
    }
});

const accountActionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {error: "Too many account actions. Please slow down and try again later."},
    keyGenerator: (req) => {
        return req.cookies.REFRESH_TOKEN || req.ip;
    }
});


router.post("/register", registerLimiter, UserController.register)
router.post("/login", loginLimiter, UserController.login)

router.get("/logout", accountActionLimiter, UserController.logout)
router.post("/logoutEverywhere", accountActionLimiter, UserController.logoutEverywhere)
router.post("/changePassword", accountActionLimiter, UserController.changePassword)
router.post("/refresh", refreshLimiter, UserController.refreshJwtToken)

export default router;