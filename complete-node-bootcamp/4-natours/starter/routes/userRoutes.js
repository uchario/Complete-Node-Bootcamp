const express = require('express');
const { 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUserById, 
    deleteUserById 
} = require('./../controllers/userController');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = router;