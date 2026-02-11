import express from 'express';
import * as periodController from '../controllers/periodController.js';
import {hasAccessToSchool, hasAdminAccessToSchool} from "../guards/user_guards.ts";

const router = express.Router();

router.get('/', hasAccessToSchool, periodController.getAllPeriods);
router.get('/current', hasAccessToSchool, periodController.getCurrentPeriod);
router.get('/next', hasAccessToSchool, periodController.getNextPeriod);

router.post('/', hasAdminAccessToSchool, periodController.createPeriod);
router.put('/', hasAdminAccessToSchool, periodController.updatePeriod);
router.delete('/', hasAdminAccessToSchool, periodController.deletePeriod);

export default router;