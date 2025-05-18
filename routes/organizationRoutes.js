import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from '../controllers/organizationController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();


router.get('/me', verifyToken, getProfile);

router.put(
  '/me',
  verifyToken,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'bannerPic', maxCount: 1 }
  ]),
  updateProfile
);


router.get('/', getAllOrganizations); 
router.get('/:id', getOrganizationById); 

router.put(
  '/:id',
  upload.single('membershipProof'), 
  updateOrganization
);

router.delete('/:id', deleteOrganization); 

export default router;
