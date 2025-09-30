const express = require('express')
const route = express.Router()
const admin = require('../Middleware/authAdmin')
const {addProduct} = require('../controllers/product')


route.post('/addproduct',admin,addProduct)

module.exports = route