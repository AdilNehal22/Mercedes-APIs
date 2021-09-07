const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const Cars = require('./../models/carsModel');
//const Cars = require('./cars.json');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(db).then(()=>console.log('connected to database'));

const cars = JSON.parse(fs.readFileSync(`${__dirname}/cars.json`, 'utf-8'));

const importData = async()=>{
     try{
          await Cars.create(cars);
          console.log('data succesfully loaded');
     }catch(err){
          console.log(err);
     }
     process.exit();
}

console.log(process.argv);
if(process.argv[2] === '--import'){
     importData()
}


