import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/byDate', scheduleController.getSchedulesByDate);
router.get('/byClassIdForDate', scheduleController.getSchedulesByClassForDate);
router.get('/byDateTimeAndSchool', scheduleController.getSchedulesByDateTimeAndSchool);
router.post('/', scheduleController.createSchedule);
router.put('/', scheduleController.updateSchedule);
router.delete('/', scheduleController.deleteSchedule);

export default router;