import express from 'express';
import {
  updateUser,
  deleteUser,
  signOutUser,
  getUser,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRoute = express.Router();

userRoute.post('/update/:id', authMiddleware, updateUser);
userRoute.delete('/delete/:id', authMiddleware, deleteUser);
userRoute.get('/signout', authMiddleware, signOutUser);
userRoute.get('/:id', authMiddleware, getUser);

export default userRoute;
