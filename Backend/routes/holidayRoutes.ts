import express from 'express';
import * as holidayController from '../controllers/holidayController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get('/all', hasAccessToSchool, holidayController.getAllHolidays);
router.get('/', hasAccessToSchool, holidayController.getHolidayById);
router.post('/', hasAdminAccessToSchool, holidayController.createHoliday);
router.put('/', hasAdminAccessToSchool, holidayController.updateHoliday);
router.delete('/', hasAdminAccessToSchool, holidayController.deleteHoliday);


export default router;