// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('API Error:', err);

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with invalid ID: ${err.value}`,
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    const duplicateValue = err.keyValue ? err.keyValue[duplicateField] : '';
    let message = `Duplicate value: '${duplicateValue}' already exists for ${duplicateField}.`;

    if (duplicateField === 'employeeId') {
      message = `An employee with Employee ID '${duplicateValue}' already exists. Employee ID must be unique.`;
    } else if (duplicateField === 'email') {
      message = `An employee with Email '${duplicateValue}' already exists. Email must be unique.`;
    } else if (duplicateField === 'phone') {
      message = `An employee with Phone number '${duplicateValue}' already exists. Phone number must be unique.`;
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      errors: messages,
    });
  }

  // Fallback for general server errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

// 404 Route Not Found middleware
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
