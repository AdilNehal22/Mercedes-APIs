const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'User must have a name']
     },

     email: {
          type: String,
          required: [true, 'User must have an email'],
          unique: true,
          lowercase: true,
          validate: [validator.isEmail, 'Please provide a valid email']
     },

     password: {
          type: String,
          required: [true, 'A user must have a password'],
          minlength: 8,
          select: false
     },

     passwordChangedAt: Date,

     photo: String,

     role: {
          type: String,
          enum: ['purchaser','admin'],
          default: 'purchaser',
     },

     passwordConfirm: {
          type: String,
          required: [true, 'Please confirm your password'],
          validate: {
               validator: function(el){
                    return el === this.password
               },
               message: 'passwords are not the same'
          }
     },
     passwordResetToken: String,
     passwordResetExpires: Date,
     active: {
          type: Boolean,
          select: false,
          default: true
     },

     googleId: String

});

userSchema.pre('save', async function(next){
     if(!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 12);
     this.passwordConfirm = undefined;
     next();
});

userSchema.pre('save', function(next){
     if(!this.isModified('password') || this.isNew) return next();
     this.passwordChangedAt = Date.now() - 1000;
     next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
     return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
     if(this.passwordChangedAt){
          const timeStampChangedFormat = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
          return JWTTimeStamp < timeStampChangedFormat;
     };
     return false;
};

userSchema.methods.createPasswordResetToken = function(){
     const resetToken = crypto.randomBytes(32).toString('hex');
     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
     return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;