import express from 'express';
import { createEvent, getAllEvents, getEventById } from '../controllers/eventController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  upload.fields([{ name: 'banners', maxCount: 5 }, { name: 'documents', maxCount: 5 }]),
  createEvent
);

router.get('/', getAllEvents);
router.get('/:id', getEventById);

export default router;
