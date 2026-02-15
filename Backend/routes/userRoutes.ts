// routes/courseRoutes.js
import express from 'express';
import UserController from "../controllers/userController.ts";
import {hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.post("/register", hasAdminAccessToSchool, UserController.register)
router.post("/login", UserController.login)
router.get("/logout", UserController.logout)

router.get("/promote", hasAdminAccessToSchool, UserController.promoteUserToAdmin);
router.get("/demote", hasAdminAccessToSchool, UserController.demoteUserFromAdmin);
router.get("/addToSchool", hasAdminAccessToSchool, UserController.addUserToSchool)
router.get("/removeFromSchool", hasAdminAccessToSchool, UserController.removeUserPermissionsForSchool)


export default router;