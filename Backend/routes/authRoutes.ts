import express from 'express';
import UserController from "../controllers/userController.ts";

const router = express.Router();

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/logout", UserController.logout)
router.post("/logoutEverywhere", UserController.logoutEverywhere)
router.post("/changePassword", UserController.changePassword)
router.post("/refresh", UserController.refreshJwtToken)

export default router;