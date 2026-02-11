import express from 'express';
import * as subjectController from '../controllers/subjectController.ts';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get("/all", hasAccessToSchool, subjectController.getAllSubjects)
router.post('/', hasAdminAccessToSchool, subjectController.createSubject);
router.delete('/', hasAdminAccessToSchool, subjectController.deleteSubject);
router.put('/', hasAdminAccessToSchool, subjectController.updateSubject);

export default router;