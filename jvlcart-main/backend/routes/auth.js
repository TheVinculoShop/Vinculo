const express = require('express');
const multer = require('multer');
const path = require('path');
const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads/user'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

// User routes
router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);

// Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

// Google OAuth routes
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed." });
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email_verified, name, email } = ticket.getPayload();

        if (email_verified) {
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ name, email });
                await user.save();
            }

            // Generate token or session
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Google login failed. Email not verified.'
            });
        }
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
