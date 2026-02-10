import express from 'express';
import * as holidayController from '../controllers/holidayController.js';
const router = express.Router();

router.get('/', holidayController.getAllHolidays);
router.post('/', holidayController.createPeriod);
router.put('/', holidayController.updatePeriod);
router.delete('/', holidayController.deletePeriod);


export default router;