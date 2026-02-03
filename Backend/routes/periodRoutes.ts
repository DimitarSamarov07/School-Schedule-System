import express from 'express';
import * as periodController from '../controllers/periodController.js';

const router = express.Router();

router.get('/', periodController.getAllPeriods);
router.post('/', periodController.createPeriod);
router.put('/', periodController.updatePeriod);
router.delete('/', periodController.deletePeriod);

router.get('/current', periodController.getCurrentPeriod);
router.get('/next', periodController.getNextPeriod);

export default router;