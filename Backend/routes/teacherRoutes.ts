import express from 'express';
import * as teacherController from '../controllers/teacherController.js';

const router = express.Router();

router.get('/all', teacherController.getAllTeachers);
router.delete('/', teacherController.deleteTeacher);
router.put('/', teacherController.updateTeacher);
router.post('/', teacherController.createTeacher);

export default router;