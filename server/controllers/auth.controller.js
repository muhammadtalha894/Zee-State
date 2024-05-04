import User from '../models/user.model.js';
import { tokenResponse } from '../utils/token.js';
import ErrorHandler from '../utils/errorHandlerClass.js';

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newuser = await User.create({ username, email, password });
    console.log(req.body);

    res.status(201).json({ success: true, newuser });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return next(new ErrorHandler('User not found!', 400));

    const validatePassword = await user.comparePassword(password);

    if (!validatePassword)
      return next(new ErrorHandler('Invalid credential!', 400));

    tokenResponse(user, res);
  } catch (error) {
    next(error);
  }
};
export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    const user = await User.findOne({ email: email });
    console.log(user);

    if (user) {
      tokenResponse(user, res);
    } else {
      const newPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      console.log(newPassword);
      const newUser = await User.create({
        username: name,
        email,
        password: newPassword,
        photo,
      });
      tokenResponse(newUser, res);
    }
  } catch (error) {
    console.log(error);
  }
};

export const myProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return next(new ErrorHandler('user not found', 400));

    const { password: password, ...rest } = user._doc;

    res.json({ success: true, rest });
  } catch (error) {
    next(error);
  }
};
