const express = require('express');

const userController = require('./../controllers/userController');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', 
        authController.updatePassword
)

router.get(
    '/me', 
    userController.getMe,
    userController.getUserById
);

router.patch(
    '/updateMe', 
    userController.updateMe,
);

router.delete(
    '/deleteMe', 
    userController.deleteMe
);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUserById)
    .delete(userController.deleteUserById);

module.exports = router;