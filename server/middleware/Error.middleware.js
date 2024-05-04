const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    message = 'Username or email already taken';
  }
  if (err.name == 'CastError') {
    message = `Resources not found.Invalid: ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
