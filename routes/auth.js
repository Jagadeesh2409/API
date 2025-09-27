const express = require('express');
const router = express.Router();
const {login,register,profile} = require('../controllers/authController')
const authentication = require('../Middleware/authMiddleware')
const upload = require('../Middleware/media')


router.post('/upload',authentication,upload.single('media'),(req,res)=>res.status(200).json({message: "image uploaded succesfully"}))

router.post('/register',register);

router.post('/login',login);

router.get('/profile',authentication,profile)



module.exports = router