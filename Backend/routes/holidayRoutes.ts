import express from 'express';
import * as holidayController from '../controllers/holidayController.js';

const router = express.Router();

router.get('/all', holidayController.getAllHolidays);
router.get('/', holidayController.getHolidayById);
router.post('/', holidayController.createHoliday);
router.put('/', holidayController.updateHoliday);
router.delete('/', holidayController.deleteHoliday);


export default router;