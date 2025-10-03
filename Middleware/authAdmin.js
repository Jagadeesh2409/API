const json=require('jsonwebtoken')
require('dotenv').config()

const admin =(req,res,next)=>{
    const header = req.headers['authorization']; 
    const token = header.split(' ')[1]
    json.verify(token,process.env.JWT_SECRET,(err,decode)=>{

        if(err){
            return res.status(400).json({message:"token expired"})     
        }
        req.user=decode 
        if(decode.role=='admin'){
             next()
        }        
    })
}


module.exports = admin