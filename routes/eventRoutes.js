import express from 'express';
import {
  createEvent,
  getAllEvents,
  searchEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
    { name: 'photos', maxCount: 10 },
  ]),
  createEvent
);

router.get('/search', searchEvents);
router.get('/', getAllEvents);
router.get('/:id', getEventById);


router.put(
  '/:id',
  verifyToken,
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
    { name: 'photos', maxCount: 10 },
  ]),
  updateEvent
);

router.delete('/:id', verifyToken, deleteEvent);

export default router;
