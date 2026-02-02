import express from 'express';
import * as classController from '../controllers/classController.js';

const router = express.Router();

router.get('/', classController.getAllClasses);
router.post('/', classController.createClass);
router.put('/', classController.updateClass);
router.delete('/', classController.deleteClass);

export default router;