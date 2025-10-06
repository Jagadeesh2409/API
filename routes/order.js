const knex = require('../controllers/checkout')
const express = require('express')
const Routers = express.Router()
const admin = require('../Middleware/authAdmin')
const {setAddress,makeOrder} = require('../controllers/checkout')


Routers.post('/address',admin,setAddress)
Routers.post('/checkout',admin,makeOrder )

module.exports = Routers