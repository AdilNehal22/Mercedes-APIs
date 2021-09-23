const express = require('express');
const carController = require('./../controllers/carController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
.route('/')
.get(authController.protect ,carController.getAllCars)
.post(carController.authorizeReq, carController.createCar)

router
.route('/:id')
.get(carController.getACar)
.patch(carController.authorizeReq, carController.patchCar)
.delete(authController.protect, authController.restrictTo('admin') ,carController.deleteCar);

module.exports = router