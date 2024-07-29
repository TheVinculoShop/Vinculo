const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Register User - /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;

    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        avatar
    });

    sendToken(user, 201, res);
});

// Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// Logout User - /api/v1/logout
exports.logoutUser = (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "Logged out"
    });
};

// Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    let BASE_URL = process.env.FRONTEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;
    const message = `Your password reset URL is as follows: \n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});

// Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Change Password - /api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    });
});

// Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    };

    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
        newUserData = { ...newUserData, avatar };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// Admin: Get Specific User - /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Update User - /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        phone: req.body.phone,
        address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Delete User - /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
        success: true,
    });
});

// Google Login - /api/v1/google-login
exports.googleLogin = catchAsyncError(async (req, res, next) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                // If phone and address are not available from Google, set them as empty or handle accordingly
                phone: '',
                address: ''
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler('Google login failed', 500));
    }
});
