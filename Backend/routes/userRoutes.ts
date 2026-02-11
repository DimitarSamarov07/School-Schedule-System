// routes/courseRoutes.js
import express from 'express';
import UserController from "../controllers/userController.ts";
import {hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.post("/register", hasAdminAccessToSchool, UserController.register)
router.post("/login", UserController.login)


export default router;