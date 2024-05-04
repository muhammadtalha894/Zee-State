import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandlerClass.js';
export const authMiddleware = (req, res, next) => {
  const token = req.cookies['access_token'];
  if (!token) {
    return next(new ErrorHandler('User not login', 401));
  }

  const tokenResolve = jwt.verify(token, process.env.JSON_SECRET_KEY);

  if (tokenResolve) {
    req.user = tokenResolve.id;
  }

  next();
};
