import express from 'express';
import {hasAccessToSchool, hasSudoAccess} from "../guards/user_guards.ts";
import {
    createSchool,
    getAllSchools,
    getSchoolWorkWeekConfig,
    getUsersBySchoolId,
    updateSchool
} from "../controllers/schoolController.ts";


const router = express.Router();

router.get("/", hasAccessToSchool, getUsersBySchoolId)
router.post("/", hasSudoAccess, createSchool)
router.put("/", hasSudoAccess, updateSchool)

router.get("/all", hasAccessToSchool, getAllSchools)
router.get("/allUsers", hasAccessToSchool, getUsersBySchoolId)
router.get("/workWeek", hasAccessToSchool, getSchoolWorkWeekConfig)

export default router;