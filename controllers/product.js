const knex = require('../db/knex')


const viewProducts = async(req,res) =>{
    try {
   const products = await knex('products as p')
  .leftJoin('products_img as i', 'p.id', 'i.product_id')
  .select(
    'p.id',
    'p.name',
    'p.description',
    'p.price',
    'p.categories',
    knex.raw('COALESCE(GROUP_CONCAT(i.url), "") as images')
  )
  .groupBy('p.id');


        if(!products) return res.status(400).json({message:"no products in the database"})
        return res.status(200).json({products})
    } catch (error) {
        return res.status(400).json({message:error.message})  
    }
}


const addProduct = async (req, res) => {
    try {

        const { name, description, price, categories} = req.body;
        const url = `${req.protocol}://${req.host}/${req.file.path}`
        console.log(url)
        
        const categ = await knex('categories').where({ name: categories }).first()
        if (!categ) {
            await knex('categories').insert({ name: categories })
        }
        const data = {
            name,
            price,
            description,
            categories: categ.id
        }

        const product = await knex('products').insert(data)
        await knex('products_img').insert({product_id:product[0],url})
    
        return res.status(200).json({ message: "product is added", product_id:product[0]})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

const deleteProduct = async (req, res) => {
    try {
        const id = req.body.id
        console.log(id)
        const del = await knex('products').where({ id }).del()
        if (!del) {
            return res.status(200).json({ message: "no product key available" })
        }
        return res.status(200).json({message:"product is removed"})
        
    } catch (error) {
        return res.status(200).json({message:error.message})
    }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categories, images } = req.body;

    const product = await knex('products').where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await knex('products')
      .where({ id })
      .update({
        name,
        description,
        price,
        categories: JSON.stringify(categories), // if stored as JSON
        updated_at: knex.fn.now()
      });

    return res.status(200).json({ message: "Product updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { addProduct ,deleteProduct,viewProducts, updateProduct}