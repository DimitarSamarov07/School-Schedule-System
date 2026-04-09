// routes/courseRoutes.js
import express from 'express';
import UserController from "../controllers/userController.ts";
import {hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/logout", UserController.logout)
router.post("/changePassword", UserController.changePassword)

router.post("/promote", hasAdminAccessToSchool, UserController.promoteUserToAdmin);
router.post("/demote", hasAdminAccessToSchool, UserController.demoteUserFromAdmin);
router.post("/addToSchool", hasAdminAccessToSchool, UserController.addUserToSchool)
router.post("/removeFromSchool", hasAdminAccessToSchool, UserController.removeUserPermissionsForSchool)


export default router;