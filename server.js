const express = require('express')
const app = express()
const route = require('./routes/product')
const router = require('./routes/cart')
const path = require('path');
const Routers =require('./routes/order')

app.use('/product_images', express.static(path.join(__dirname, 'product_images')));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/admin', route)
app.use('/cart', router)
app.use('/order', Routers)

app.listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000");
});


