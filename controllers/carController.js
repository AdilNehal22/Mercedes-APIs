const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const Cars = require('./../models/carsModel');
const APIFeatures = require('./../Utils/APIFeatures');


exports.authorizeReq = (req, res, next)=>{
     if(!req.body.name || !req.body.price || !req.body.color){
          res.status(404).json({
               status : "failed",
               message : "Invalid or incomplete request"
          })
     }
     next();
}

exports.getAllCars = async(req, res)=>{
     try{
          const features = new APIFeatures(Cars.find(), req.query)
          .filtering().sorting().limitingFields().pagenation();
          const cars = await features.query;
          console.log(features)
          res.status(200).json({
               status: 'success',
               data: {
                    cars
               }
          })
     }catch(err){
          console.log(err);
          res.status(400).json({
               status: 'failed',
               message: err
          })

     }
}

exports.createCar = async (req, res)=>{
     try{
          const newCar = await Cars.create(req.body);
          res.status(201).json({
               status: 'success',
               data: {
                    mercedes: newCar
               }
          })
     }catch(err){
          console.log(err)
          res.status(400).json({
               status: 'failed',
               message: 'Invalid or incomplete request'
          })
     }
}

exports.getACar = async (req, res)=>{
     try{
          const Acar = await Cars.findById(req.params.id);
          res.status(200).json({
               status : 'success',
               data: {
                    Acar
               }
          })
     }

     catch(err){
          res.status(400).json({
               status : 'failed',
               message: err
          })
     }
}

exports.patchCar = async(req, res)=>{
     try{
          const updateCar = await Cars.findByIdAndUpdate(req.params.id, req.body, {
               new: true,
               runValidators: true
          })
               return res.status(201).json({
                    status : 'success',
                    data: {
                         updateCar
                    }
               })     
     }catch(err){
          res.status(400).json({
               status: 'failed',
               message: 'Invalid request'
          })
     }
     
}

exports.deleteCar = async (req, res)=>{
     try{
          const delCar = await Cars.findByIdAndDelete(req.params, req.body);
          res.status(204).json({
               status: 'success',
               data: null
          })
     }catch(err){
          res.status(400).json({
               status: 'failed',
               message: 'Invalid request'
          })
     }
};
