const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
      return res.status(400).json({
          success: false,
          error: Object.values(err.errors).map(val => val.message)
      });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
          success: false,
          error: `Duplicate value entered for ${field} field`
      });
  }

  // Custom API error
  if (err.isOperational) {
      return res.status(err.statusCode).json({
          success: false,
          error: err.message
      });
  }

  // Default error
  res.status(500).json({
      success: false,
      error: 'Server Error'
  });
};

module.exports = errorHandler;