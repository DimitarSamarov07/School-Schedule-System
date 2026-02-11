import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get("/", hasAccessToSchool, scheduleController.getScheduleById)
router.get('/byDate', hasAccessToSchool, scheduleController.getSchoolSchedulesByDate);
router.get('/betweenDates', hasAccessToSchool, scheduleController.getSchoolScheduleBetweenDates);
router.get('/byClassIdForDate', hasAccessToSchool, scheduleController.getSchedulesByClassForDate);
router.get('/byDateTimeAndSchool', hasAccessToSchool, scheduleController.getSchedulesByDateTimeAndSchool);

router.post('/', hasAdminAccessToSchool, scheduleController.createSchedule);
router.put('/', hasAdminAccessToSchool, scheduleController.updateSchedule);
router.delete('/', hasAdminAccessToSchool, scheduleController.deleteSchedule);

export default router;