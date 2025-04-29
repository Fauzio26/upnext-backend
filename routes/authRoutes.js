import express from 'express';
import { signUpOrganization, signInOrganization } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUpOrganization);
router.post('/signin', signInOrganization);

export default router;
