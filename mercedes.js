const express = require('express');
const morgan = require('morgan')
const carRouter = require('./routes/carRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./errorHandling/AppError');
const globalErrHandle = require('./errorHandling/globalErrHandle');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const passport = require('passport');
const cookieSession = require('cookie-session');
const passportSetup = require('./Utils/passport-setup');
const ssoRouter = require('./routes/ssoRoute');
const keys = require('./Utils/keys');


const app = express();

app.use(cookieSession({
     maxAge: 24*60*60*1000,
     keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({limit: '10kb'}));
///////////////////////////////////////////////////////////////////////
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(xss());

app.use(helmet());

app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
     max: 100,
     windowMs: 60*60*1000,
     message: 'You have tried a lot, please wait and then try again later'
});
app.use('/api',limiter);
/////////////////////////////////////////////////////////////////////

app.use((req,res,next)=>{
     req.requestTime = new Date().toISOString();
     next();
});

//sub application carRouter who has its own routes
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/users', userRouter);
app.use('/auth', ssoRouter);

app.use('*', (req, res, next)=>{
     next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrHandle);



module.exports = app;