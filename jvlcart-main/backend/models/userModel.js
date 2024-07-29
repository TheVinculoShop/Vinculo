const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please enter phone number'],
        validate: [validator.isMobilePhone, 'Please enter a valid phone number']
    },
    address: {
        type: String,
        required: [true, 'Please enter address']
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

userSchema.methods.isValidPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
    // Generate Token
    const token = crypto.randomBytes(20).toString('hex');

    // Generate Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
