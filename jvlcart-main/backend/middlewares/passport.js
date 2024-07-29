const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel"); // Replace with your user model

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Find or create a user in the database
				let user = await User.findOne({ googleId: profile.id });
				if (!user) {
					user = await User.create({
						googleId: profile.id,
						name: profile.displayName,
						email: profile.emails[0].value,
						avatar: profile.photos[0].value,
					});
				}
				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user); // Attach user object to request
	} catch (err) {
		done(err, null);
	}
});
