import express from 'express';
import * as periodController from '../controllers/periodController.js';

const router = express.Router();

router.get('/period', periodController.getAllPeriods);
router.post('/period', periodController.createPeriod);
router.put('/period', periodController.updatePeriod);
router.delete('/period', periodController.deletePeriod);

router.get('/currentPeriod', periodController.getCurrentPeriod);
router.get('/nextPeriod', periodController.getNextPeriod);

export default router;