import express from 'express';
import isAuthenticated from '../Middlewares/Auth.js';
import { getProfile, updateProfile } from '../Controllers/ProfileController.js';

const router = express.Router();

router.get('/me', isAuthenticated, getProfile);
router.put('/update', isAuthenticated, updateProfile);

export default router;