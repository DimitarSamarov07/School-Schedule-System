import express from 'express';
import * as classController from '../controllers/classController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get('/all', hasAccessToSchool, classController.getAllClasses);
router.post('/', hasAdminAccessToSchool, classController.createClass);
router.put('/', hasAdminAccessToSchool, classController.updateClass);
router.delete('/', hasAdminAccessToSchool, classController.deleteClass);

export default router;