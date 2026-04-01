import express from 'express';
import {hasAccessToSchool} from "../guards/user_guards.ts";
import {getAllSchools, getUsersBySchoolId, getSchoolWorkWeekConfig} from "../controllers/schoolController.ts";


const router = express.Router();

router.get("/", hasAccessToSchool, getUsersBySchoolId)
router.get("/all", hasAccessToSchool, getAllSchools)
router.get("/allUsers", hasAccessToSchool, getUsersBySchoolId)
router.get("/workWeek", hasAccessToSchool, getSchoolWorkWeekConfig)

export default router;