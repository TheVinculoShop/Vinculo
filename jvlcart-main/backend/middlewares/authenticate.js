const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel');
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    // Check if the token exists
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to the request
        req.user = await User.findById(decoded.id);

        // Check if the user exists
        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token', 401));
    }
});

// Middleware to authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is authorized
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403));
        }

        next();
    };
};
