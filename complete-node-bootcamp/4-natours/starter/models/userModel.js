const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password confirmation is required'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    photo: {
        type: String
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetTokenExpiresIn = Date.now() + (10 * 60 * 1000);
    console.log(resetToken, this.passwordResetToken, this.passwordResetTokenExpiresIn)
    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;