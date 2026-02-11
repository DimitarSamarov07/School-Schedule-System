import express from 'express';
import * as roomController from '../controllers/roomController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get('/all', hasAccessToSchool, roomController.getAllRooms);
router.post('/', hasAdminAccessToSchool, roomController.createRoom);
router.put('/', hasAdminAccessToSchool, roomController.updateRoom);
router.delete('/', hasAdminAccessToSchool, roomController.deleteRoom);

export default router;