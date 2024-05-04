import ErrorHandler from '../utils/errorHandlerClass.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const updateUser = async (req, res, next) => {
  if (req.user !== req.params.id)
    return next(new ErrorHandler('You can only update your own account!'));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          photo: req.body.photo,
        },
      },
      { new: true },
    );
    const { password, ...rest } = updatedUser._doc;

    res.status(201).json({ success: true, rest });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user !== req.params.id)
    return next(new ErrorHandler('User not found', 400));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie('access_token').json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const signOutUser = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json({ success: true, message: 'Successfully sign out' });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler('User not found!'));

  const { password, ...rest } = user._doc;

  res.status(200).json({ success: true, rest });
};
