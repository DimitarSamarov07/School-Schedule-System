import express from 'express';
import * as subjectController from '../controllers/subjectController.ts';

const router = express.Router();

router.get("/all", subjectController.getAllSubjects)
router.post('/', subjectController.createSubject);
router.delete('/', subjectController.deleteSubject);
router.put('/', subjectController.updateSubject);

export default router;