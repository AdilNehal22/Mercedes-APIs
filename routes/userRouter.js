const express = require('express');
const userController = require('./../controllers/userController');
const authenticateUser = require('./../controllers/authController');
const passport = require('passport');
const passportSetup = require('./../Utils/passport-setup');

const router = express.Router();

router.post('/signup', authenticateUser.signup);
router.post('/login', authenticateUser.login);

router.post('/forgotPassword', authenticateUser.forgotPassword);
router.patch('/resetPassword/:token', authenticateUser.resetPassword);
router.patch('/updatePassword',authenticateUser.protect ,authenticateUser.updatePassword);
// //put the user object on req.obj -> authenticateUser.protect
router.patch('/updateMe', authenticateUser.protect, userController.updateMe);
router.delete('/deleteMe', authenticateUser.protect, userController.deleteMe);


router
.route('/')
.get(userController.getAllUsers);

module.exports = router;