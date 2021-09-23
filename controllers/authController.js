const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../errorHandling/catchAsync');
const AppError = require('./../errorHandling/AppError');
const mailer = require('./../Utils/mailer');
const passport = require('passport');



const signToken = id => {
     return jwt.sign({id}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
     });
};

const createSendToken = (user, statusCode, res)=>{
     const cookieOption = {
          expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
          httpOnly: true
     };

     if(process.env.NODE_ENV === 'production') cookieOption.secure = true;

     res.cookie('jwt', signToken, cookieOption);
     user.password = undefined;
     const token = signToken(user._id)
     res.status(statusCode).json({
          status: 'success',
          token,
          data: {
               user
          }
     });
};

exports.signup = catchAsync(async(req, res, next)=>{

     const newUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          role: req.body.role
     });

     createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async(req, res, next)=>{
     const { email, password } = req.body;
     if(!email || !password){
          return next(new AppError('Please provide email or password to log you in', 400));
     };

     const user = await User.findOne({email}).select('+password');
     if(!user || !await user.correctPassword(password, user.password)){
          return next(new AppError('Please provide correct email or password', 401));
     };

     createSendToken(user, 200, res);
});

exports.protect = catchAsync(async(req, res, next)=>{
     let token;
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
          token = req.headers.authorization.split(' ')[1];
     };

     if(!token){
          return next(new AppError('You are not logged in!, Please login to get access', 401));
     };

     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

     const thisUser = await User.findById(decoded.id);
     if(!thisUser){
          return next(new AppError('The user doesnot exists', 401));
     };

     if(thisUser.changedPasswordAfter(decoded.iat)){
          return next(new AppError('User recently changed password, please login again', 401));
     };
     req.user = thisUser;

     next();

});

exports.restrictTo = (...roles)=>{
     return (req, res, next)=>{
          if(!roles.includes(req.body.role)){
               return next(new AppError('You donot have permission to perform this action', 403));
          };
          next();
     };
};

exports.forgotPassword = catchAsync(async(req, res, next)=>{

     //1) get user based on POSTed email
     const user = await User.findOne({email: req.body.email});
     if(!user){
          return next(new AppError('There is no user with this Email', 404));
     };

     //2) generate random reset token 
     const resetToken = user.createPasswordResetToken();
     await user.save({ validateBeforeSave: false });

     //3) send it to user's email
     const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;


     const message = `Forgot your password?Follow the link to reset your password: ${resetURL}\nIf you did'nt forget your password, please ignore this email`;

     try{
          await mailer({
               email: user.email,
               subject: 'your password reset link. Valid for 10 minutes',
               message
          });
          res.status(200).json({
               status: 'success',
               message: 'Link to reset password sent to email'
          });
     }catch(err){
          console.log(err);
          user.createPasswordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save({ validateBeforeSave: false });
          return next(new AppError('There was an error sending the email please try again later'),500);
     };
});

exports.resetPassword = catchAsync(async(req, res, next)=>{
     //1_get user based on token
     const userToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
     //2_if token is not expired and there is user set new password
     const user = await User.findOne({passwordResetToken: userToken, passwordResetExpires: {$gt: Date.now()}});

     if(!user){
          return next(new AppError('The link is invalid or may be expired', 400));
     };

     //3_update changedPasswordAt functionality for the user
     //done in user model

     //4_log the user in, send JWT
     user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save();

    createSendToken(user, 200, res);

});

exports.updatePassword = catchAsync(async(req, res, next)=>{
     //1_get user from the collection
     const user = await User.findById(req.user.id).select('+password');
     //2_check if posted password is correct
     if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
          return next(new AppError('please provide the correct password', 401));
     }
     //3_if so update the password
     user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
     await user.save();

     createSendToken(user, 200, res);
});

