const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev & production debugging
  console.error('[Global Error Handler]:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Payload / Entity too large
  if (err.type === 'entity.too.large' || err.name === 'PayloadTooLargeError') {
    statusCode = 413;
    error.message = 'File or image payload size is too large (maximum 10MB allowed)';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    error.message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    error.message = 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
