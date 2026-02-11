import express from 'express';
import * as teacherController from '../controllers/teacherController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get('/all', hasAccessToSchool, teacherController.getAllTeachers);
router.delete('/', hasAdminAccessToSchool, teacherController.deleteTeacher);
router.put('/', hasAdminAccessToSchool, teacherController.updateTeacher);
router.post('/', hasAdminAccessToSchool, teacherController.createTeacher);

export default router;