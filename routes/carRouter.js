const express = require('express');
const fs = require('fs');
const carController = require('./../controllers/carController');

const router = express.Router();

router
.route('/')
.get(carController.getAllCars)
.post(carController.authorizeReq, carController.createCar)

router
.route('/:id')
.get(carController.getACar)
.patch(carController.patchCar)
.delete(carController.deleteCar)

module.exports = router