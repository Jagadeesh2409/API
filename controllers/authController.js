const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const knex=require('../db/knex')


const register = async(req,res)=>{
    const {name,email,password} = req.body
    if(!name||!email||!password){
        return res.status(400).json({message:"require all the fields"})
    }

    const salt = parseInt(process.env.SALT_ROUND) 
    const hashedPassword = await bcrypt.hash(password,salt)

    await knex('accounts').insert({name,email,password:hashedPassword})

    return res.status(200).json({message:"user successfully registered"})
 
}

const login = async(req,res)=>{
    const{email,password} = req.body
     if(!email||!password){
        return res.status(400).json({message:"require all the fields"})
    }
    try{
    const user = await knex('accounts').where({email}).first()
    const verify = bcrypt.compare(password,user.password) 
    if(!verify){
        return res.status(400).json({message:"username or password incorrect"})
    }
    const token = jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET)

    return res.status(200).json({message:"user succesfully login",token})
    }

    catch(err){
        return res.status(500).json({message:"you haven't account"})
    }
     
}

const profile = async (req,res) => {
    const id=req.user.id
    const data =await knex('accounts').where({id})
    return res.status(200).json({message:data})  
}


module.exports={register,login,profile}


