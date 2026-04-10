// routes/courseRoutes.js
import express from 'express';
import UserController from "../controllers/userController.ts";
import {hasAdminAccessToSchool, hasSudoAccess} from "../guards/user_guards.ts";

const router = express.Router();

router.post("/revokeUserTokens", hasSudoAccess, UserController.logoutUserEverywhere)
router.post("/promote", hasAdminAccessToSchool, UserController.promoteUserToAdmin);
router.post("/demote", hasAdminAccessToSchool, UserController.demoteUserFromAdmin);
router.post("/addToSchool", hasAdminAccessToSchool, UserController.addUserToSchool)
router.post("/removeFromSchool", hasAdminAccessToSchool, UserController.removeUserPermissionsForSchool)


export default router;