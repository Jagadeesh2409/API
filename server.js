const express = require('express')
const app = express()
const routes = require('./routes/auth')
const path = require('path')
const router1 =require('./routes/upload')
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api',routes)
app.use('/api',router1)


app.listen(3000,()=>{
    console.log("http://localhost:3000")
})