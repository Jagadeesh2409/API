const express = require('express')
const router = express.Router()
const {addToCart, removeFromCart, getCart} = require('../controllers/cart')

const admin = require('../Middleware/authAdmin')

router.post('/add',admin, addToCart);
router.delete('/remove/:productId',admin, removeFromCart);
router.get('/:userId',admin, getCart);

module.exports = router