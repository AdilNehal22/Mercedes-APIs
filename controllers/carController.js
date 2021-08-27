const express = require('express');
const fs = require('fs');

const cars = JSON.parse(fs.readFileSync(`${__dirname}/../Data/cars.json`));


exports.authorizeReq = (req, res, next)=>{
     if(!req.body.id || !req.body.model || !req.body.price || !req.body.color){
          res.status(404).json({
               status : "failed",
               message : "Invalid or incomplete request"
          })
     }
     next();
}

exports.getAllCars = (req, res)=>{
     res.status(200).json({
          status : "success",
          results : cars.length,
          data : {
               cars
          }
     });
}

exports.createCar = (req, res)=>{
     const newCarId = cars[cars.length - 1].id + 1;
     const newCar = Object.assign({id : newCarId}, req.body);
     cars.push(newCar);
     fs.writeFile(`${__dirname}/Data/cars.json`, JSON.stringify(cars), err=>{
          res.status(201).json({
               status : "success",
               data : {
                    car: newCar
               }
          })
     })
}

exports.getACar = (req, res)=>{
     const id = req.params.id * 1
     const Acar = cars.find(el => el.id === id);
     if(!Acar){
          res.status(404).json({
               status : "failed",
               message : "invalid ID"
          })
     }
     res.status(200).json({
          status : "success",
          data : {
               Acar
          }
     })
}

exports.patchCar = (req, res)=>{
     const id = req.params.id * 1
     const Acar = cars.find(el => el.id === id);
     if(!Acar){
          return res.status(404).json({
               status : "failed",
               message : "request not found"
          })
     }
     Acar.price = req.body.price;
     fs.writeFile(`${__dirname}/Data/cars.json`, JSON.stringify(cars), err=>{
          res.status(201).json({
               status : "success",
               data : {
                    car : Acar
               }
          });
     });
}

exports.deleteCar = (req, res)=>{
     const id = req.params.id * 1
     let Acar = cars.find(el => el.id === id);
     if(!Acar){
          return res.status(404).json({
               status : "failed",
               message : "request not found"
          })
     }
     cars.splice(cars.indexOf(Acar, 1));
     fs.writeFile(`${__dirname}/Data/cars.json`, JSON.stringify(cars), err=>{
          res.status(204).json({
               status : "success",
               data : {
                    cars
               }
          });
     });
};
