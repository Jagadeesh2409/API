const express=require('express')
const app=express()
const route =require('./routes/product')


app.use(express.json())

app.use('/admin',route)

app.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000");
});