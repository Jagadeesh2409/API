const knex = require('../db/knex')
const addProduct =async(req,res)=>{
    const {name,desc,price,categories,image} =req.body;
    
    const categ = await knex('categories').where({name:categories}).first()
    if(!categ){
        await knex('categories').insert({name:categories})
    }
    const data={
        name,
        price,
        desc,
        category:categ[0].id
    }
    const product=await knex('products').insert(data)

    const img = await knex('product_image').where({product_id:product[0].id})

    if(img){
        await knex('product_image').where({product_id:product[0].id}).update({url})
    }
    await knex('product_images').insert(url)

    return res.status(200).json({message:"product is added"})

}

const deleteProduct = async(req,res)=>{
    const id=req.product.id
    const del = await knex('products').where({id}).del().returning('*')
    if(!del){
        return res.status(200).json({message:"no product key available"})
    }

}


module.exports={addProduct}