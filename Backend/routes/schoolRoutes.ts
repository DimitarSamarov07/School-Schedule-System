import express from 'express';
import {hasAccessToSchool} from "../guards/user_guards.ts";
import {getAllSchools, getSchoolById, getSchoolWorkWeekConfig} from "../controllers/schoolController.ts";


const router = express.Router();

router.get("/", hasAccessToSchool, getSchoolById)
router.get("/all", hasAccessToSchool, getAllSchools)
router.get("/workWeek", hasAccessToSchool, getSchoolWorkWeekConfig)

export default router;