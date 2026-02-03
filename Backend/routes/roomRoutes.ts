import express from 'express';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.get('/all', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.put('/', roomController.updateRoom);
router.delete('/', roomController.deleteRoom);

export default router;