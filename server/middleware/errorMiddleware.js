/**
 * Global Error Handling Middleware
 * Catch and format all system errors to prevent sensitive leakage
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for the sysadmin terminal
  console.error(`[SYSTEM-ERROR] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found Protocol Error.`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = 'Identity duplication protocol error. Record already exists.';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Mission Critical System Error',
    protocol: 'SWASTIK_POWER_SECURE_API_V1'
  });
};

module.exports = errorHandler;
