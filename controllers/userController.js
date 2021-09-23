const User = require('./../models/userModel');
const AppError = require('./../errorHandling/AppError');
const catchAsync = require('./../errorHandling/catchAsync');
const router = require('./../routes/userRouter');


const filteredObj = (obj, ...allowedFields)=>{
     const newObj = {};
     Object.keys(obj).forEach(el=>{
          if(allowedFields.includes(el)) newObj[el] = obj[el];
     });
     return newObj;
};


exports.getAllUsers = catchAsync(async(req, res, next)=>{
     const users = await User.find();
     res.status(200).json({
          status: 'success',
          data: {
               users
          }
     });
});

exports.updateMe = catchAsync(async(req, res, next)=>{
     //1)create error if user tries to update the password
     if(req.body.password || req.body.passwordConfirm){
          return next(new AppError('This option is not for the password updates, please use updatePassword option', 400));
     };
     //2)filtered out unwanted field names that are not allowd to be updated
     const filteredBoby = filteredObj(req.obj, 'name', 'email')
     //3)update user document
     const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBoby, {new: true, runValidators: true});

     res.status(200).json({
          status: 'success',
          data: {
               user: updatedUser
          }
     });
});

exports.deleteMe = catchAsync(async(req, res, next)=>{
     await User.findByIdAndDelete(req.user.id, {active: false});
     res.status(200).json({
          status: 'success',
          data: null
     });
});

exports.getSpecificUser = catchAsync(async(req, res, next)=>{

});

exports.updateUser = catchAsync(async(req, res, next)=>{

});

exports.deleteUser = catchAsync(async(req, res, next)=>{

});

