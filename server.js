const express = require('express')
const app = express()
const routes = require('./routes/auth')

app.use(express.json())


app.use('/api',routes)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})