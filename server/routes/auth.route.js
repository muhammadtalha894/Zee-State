import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  signUp,
  signIn,
  google,
  myProfile,
} from '../controllers/auth.controller.js';

const authRoute = express.Router();

authRoute.post('/signup', signUp);
authRoute.post('/signin', signIn);
authRoute.post('/google', google);
authRoute.get('/me', authMiddleware, myProfile);

export default authRoute;
