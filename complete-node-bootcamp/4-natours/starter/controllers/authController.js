const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    
    res.status(statusCode)
        .json({
            status: 'success',
            token,
            data: {
                user
            }
        })
}

exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

   createSendToken(newUser, 201, res);
});

exports.login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new AppError('Provide a valid email and password', 400));
    };

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

exports.protect = catchAsync( async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError("You're not authorized to access this route!", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(new AppError("User doesn't exist", 401));
    }
    
    if(freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Password changed after issued token!', 401));
    };
    
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('Unauthorized user!', 403));
        }
        next();
    });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new AppError('Invalid user!', 404))
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? send a PATCH request with your password and passwordConfirm to ${resetURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Forgot Password`,
            message
        });

        res.status(200)
            .json({
                status: 'success',
                message: 'Token sent to email!'
            });
    } catch(e) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiresIn = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('Error sending email!', 500));
    }
    next();
});

exports.resetPassword = catchAsync(async (req, res ,next) => {
    const hashedToken = crypto.createHash('sha256')
                            .update(req.params.token)
                            .digest('hex');
    
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if(!user) {
        return next(new AppError('Token is invalid or has expired', 404));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Wrong password!', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
})