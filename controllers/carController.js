const express = require('express');
const Cars = require('./../models/carsModel');
const APIFeatures = require('./../Utils/APIFeatures');
const catchAsync = require('./../errorHandling/catchAsync');
const AppError = require('./../errorHandling/AppError');


exports.authorizeReq = (req, res, next)=>{
     if(!req.body.name || !req.body.price || !req.body.color){
          res.status(404).json({
               status : "failed",
               message : "Invalid or incomplete request"
          })
     }
     next();
}

exports.getAllCars = catchAsync(async(req, res, next)=>{
     
          const features = new APIFeatures(Cars.find(), req.query)
          .filtering().sorting().limitingFields().pagenation();
          const cars = await features.query;
          console.log(features)
          res.status(200).json({
               status: 'success',
               data: {
                    cars
               }
          });
});

exports.createCar = catchAsync(async (req, res, next)=>{
     
          const newCar = await Cars.create(req.body);
          res.status(201).json({
               status: 'success',
               data: {
                    mercedes: newCar
               }
          });
});

exports.getACar = catchAsync(async (req, res)=>{
    
          const Acar = await Cars.findById(req.params.id);
          res.status(200).json({
               status : 'success',
               data: {
                    Acar
               }
          });
});

exports.patchCar = catchAsync(async(req, res)=>{

   updateCar = await Cars.findByIdAndUpdate(req.params.id, req.body, {
               new: true,
               runValidators: true
          });
               return res.status(201).json({
                    status : 'success',
                    data: {
                         updateCar
                    }
               });     
});

exports.deleteCar = catchAsync(async (req, res)=>{
          const delCar = await Cars.findByIdAndDelete(req.params, req.body);
          res.status(204).json({
               status: 'success',
               data: null
          });
});
