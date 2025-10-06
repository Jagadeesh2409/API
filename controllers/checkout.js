const knex = require('../db/knex')
/* data format
-------------
 quantity:10,
 total:100,
 products:[{id:1,quantity:5}, {id:2,quantity:4}]

inovoice
user_id
quantity
totalprice

*/
const makeOrder = async (req,res) => {
    const user_id = req.user.id
    const {quantity,total_price,products} = req.body
    const innovoiceGen = (orderId)=>`INV-${year}-${String(orderId).padStart(5, '0')}`;
   
   const shipping_address = await knex('user_addresses').where({user_id})
    
  if (!user_id || !shipping_address || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const isEmpty = await knex('orders').select('id')
    if(!isEmpty){
        await knex('orders').insert({inovoice:innovoiceGen(1),user_id,quantity,total_price})
    }
    const inovoice = isEmpty.length+1
    const order =  await knex('orders').insert({inovoice_no:innovoiceGen(inovoice),user_id,quantity,total_price})



//order_items
    const getPrice = async(id)=>{
        const data = await knex('products').where({id}).first()
        return data.price
    }

    await knex('order_items').insert(products.map((ele,ind)=>{
        const{id,quantity} = ele;
        const price =  getPrice(id)
        const total = quantity*price
        const data = {
            product_id:id,
            quantity:quantity,
            price,
            total,
            order_id:innovoiceGen(inovoice)
        }
    }))
  } catch (error) {
    return res.status(400).json({message:error.message})  
  }
}

    
 

const setAddress = async (req,res) => {
    try {
        const user_id = req.user.id
        const {name,address_line1,address_line2,city, state, postal_code, country, phone_number, is_default} = req.body
        const data ={
           user_id,name,address_line1,address_line2,city, state, postal_code, country, phone_number, is_default
        }
        const fields =  Object.values(data).some(value => !value)
        if(!fields){
            return res.status(200).json({message:"require all the fields to place orders"})   
        }
        await knex('user_addresses').insert(data)
    
        return res.status(200).json({message:"address added"})
        
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
    
}

module.exports = {setAddress,makeOrder}