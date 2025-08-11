const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Specific error handling (e.g., Mongoose validation errors)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found with ID of ${err.value}`;
    }
    if (err.code === 11000) { // Duplicate key error
        statusCode = 400;
        // Extract the field name from the error message for better feedback
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for ${field}: '${err.keyValue[field]}'. Please use a unique value.`;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;