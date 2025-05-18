import express from 'express';
import { signUpOrganization, signInOrganization } from '../controllers/authController.js';
import { signUpOrganizationSchema, signInOrganizationSchema, validateBody } from '../middlewares/authValidation.js';
import upload from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.post('/signup', upload.single('membershipProof'), validateBody(signUpOrganizationSchema), signUpOrganization);
router.post('/signin', validateBody(signInOrganizationSchema), signInOrganization);

export default router;
