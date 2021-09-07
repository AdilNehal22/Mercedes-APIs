const res = require('express/lib/response');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const carsSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'A car must have a name'],
          unique: [true, 'A car name must be unique'],
          minlength: [5, 'The car name should be equal or more than 5 words'],
          maxlength: [30, 'The car name should be equal or less than 20 words'],
          //validate: [validator.isAlpha, 'The car name should be Alpha numeric']
          
     },

     color: {
          type: String,
          required: [true, 'A car must have a color'],
          //validate: [validator.isAlpha, 'The color should be in alphabets']
     },

     price: {
          type: Number,
          required: [true, 'A car must have a price'],
     }

});


carsSchema.pre('save', function(next){
     const secKey = 'abcdefg';
     this.set({color: crypto.createHmac('sha256', secKey)
     .update(this.color).digest('hex')});
     next();
})



const Cars = mongoose.model('Cars', carsSchema);
module.exports = Cars;

