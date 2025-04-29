import express from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/organizationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/me', verifyToken, getProfile);

router.put(
  '/me',
  verifyToken,
  upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'bannerPic', maxCount: 1 }]),
  updateProfile
);

router.delete('/me', verifyToken, deleteAccount);

export default router;
