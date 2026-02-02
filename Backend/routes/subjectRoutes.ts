// routes/courseRoutes.js
import express from 'express';
import * as subjectController from '../controllers/subjectController.ts';

const router = express.Router();

router.post('/subject', subjectController.createSubject);
router.delete('/subject', subjectController.deleteSubject);
router.put('/subject', subjectController.updateSubject);

export default router;