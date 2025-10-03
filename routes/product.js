const express = require('express')
const route = express.Router()
const admin = require('../Middleware/authAdmin')
const { addProduct,deleteProduct,viewProducts,updateProduct } = require('../controllers/product')
const upload = require('../Middleware/multer')


route.post('/addproduct', admin, upload.single('image'), addProduct)
route.post('/deleteproduct', admin, deleteProduct)
route.get('/product', admin, viewProducts )
route.put('/products/:id',admin, updateProduct);


module.exports = route