const knex = require('../controllers/checkout')
const express = require('express')
const Routers = express.Router()
const authentication = require('../Middleware/authMiddleware')
const {setAddress,makeOrder} = require('../controllers/checkout')


Routers.post('/address',authentication,setAddress)
Routers.post('/checkout',authentication,makeOrder )

module.exports = Routers