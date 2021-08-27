const express = require('express');
const fs = require('fs');
const morgan = require('morgan')
const carRouter = require('./routes/carRouter');


const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req,res,next)=>{
     req.requestTime = new Date().toISOString();
     next();
});

//sub application carRouter who has its own routes
app.use('/api/v1/cars', carRouter);



module.exports = app