const express = require('express')
const app = express()
const routes = require('./routes/auth')
const path = require('path')
app.use( express.static(path.join(__dirname, 'uploads')))

app.use(express.json())


app.use('/api',routes)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})