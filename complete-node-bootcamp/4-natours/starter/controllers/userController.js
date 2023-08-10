const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync( async (req, res, next) => {
    const users = await User.find();
    res.status(200)
        .json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        })
});

exports.getUserById = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'Route not configured'
        })
}
exports.createUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'Route not configured'
        })
}
exports.updateUserById = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'Route not configured'
        })
};

exports.deleteUserById = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'Route not configured'
        })
};