require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const app = require("./app"); // Assuming 'app' is properly configured in './app'
const connectDatabase = require("./config/database");
const authRoute = require("./routes/auth");
require("./middlewares/passport"); // Ensure this file sets up passport strategies
const { googleLogin } = require('./controllers/authController');
const router = express.Router();
router.post('/google-login', googleLogin);
// Set strictQuery option for mongoose
mongoose.set('strictQuery', false);

// Connect to the database
connectDatabase();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// Cookie session configuration
app.use(
    cookieSession({
        name: "session",
        keys: [process.env.COOKIE_KEY || "defaultkey"], // Replace "defaultkey" with a more secure default if not set
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);

// Initialize passport and use sessions
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

// Use auth routes
app.use('/api/v1', authRoute);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Error handling and server start
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
});
