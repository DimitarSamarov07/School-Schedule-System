import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/schedulesByDate', scheduleController.getSchedulesByDate);
router.get('/schedulesByClassIdForDate', scheduleController.getSchedulesByClassForDate);
router.get('/schedulesByDateTimeAndSchool', scheduleController.getSchedulesByDateTimeAndSchool);
router.post('/schedule', scheduleController.createSchedule);

router.put('/schedule', scheduleController.updateSchedule);
router.delete('/schedule', scheduleController.deleteSchedule);

export default router;