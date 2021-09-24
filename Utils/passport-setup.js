const keys = require('./../Utils/keys');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('./../models/userModel');
const catchAsync = require('./../errorHandling/catchAsync');

passport.serializeUser((user, done)=>{
    done(null, user);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    // options for google strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:2000/auth/google/callback'
}, 
(accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log(`user is: ${currentUser}`);
            done(null, currentUser);
            
        } else {
            // if not, create user in our db
            new User({
                name: profile.displayName,
                googleId: profile.id
            }).save({validateBeforeSave: false}).then((newUser) => {
                console.log(`created new user: ${newUser}`);
                done(null, newUser);
            });
        }
    });
})
);
 
    



// new User({
//   name: profile.displayName,
//   googleId: profile.id
// }).save({validateBeforeSave: false}).then((newUser)=>{
//   console.log(`new user created ${newUser}`)
// })
// }