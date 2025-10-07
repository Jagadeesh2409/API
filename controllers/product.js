const knex = require("../db/knex");

const viewProducts = async (req, res) => {
  try {
    const products = await knex("products as p")
      .leftJoin("products_img as i", "p.id", "i.product_id")
      .select(
        "p.id",
        "p.name",
        "p.description",
        "p.price",
        "p.categories",
        knex.raw('COALESCE(GROUP_CONCAT(i.url), "") as images')
      )
      .groupBy("p.id");

    if (!products)
      return res.status(400).json({ message: "no products in the database" });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      original_price,
      current_price,
      categories,
      stock,
      discount,
      tax,
      brand,
      specifications,
    } = req.body;
    const url = `${req.protocol}://${req.host}/${req.file.path}`;
    console.log(url);

    const categ = await knex("categories").where({ name: categories }).first();
    if (!categ) {
      await knex("categories").insert({ name: categories });
    }
    const data = {
      name,
      original_price,
      current_price,
      discount,
      tax,
      description,
      brand,
      specifications,
      categories,
      stock,
    };

    const product = await knex("products").insert(data);
    await knex("products_img").insert({ product_id: product[0], url });

    return res
      .status(200)
      .json({ message: "product is added", product_id: product[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const del = await knex("products").where({ id }).del();
    if (!del) {
      return res.status(200).json({ message: "no product key available" });
    }
    return res.status(200).json({ message: "product is removed" });
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const id = req.body.id;
  const {
    name,
    description,
    original_price,
    current_price,
    categories,
    stock,
    discount,
    tax,
    brand,
    specifications,
  } = req.body;
  const data = {
    name,
    description,
    original_price,
    current_price,
    categories,
    stock,
    discount,
    tax,
    brand,
    specifications,
  };
  const upd = await knex("products").where({ id }).update(data);
  if (!upd) {
    return res.status(200).json({ message: "no product key available" });
  }
  return res.status(200).json({ message: "product is updated" });
};

const pricechange = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const product = await knex("products").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await knex("products").where({ id }).update({
      current_price,
      updated_at: knex.fn.now(),
    });
    return res.status(200).json({ message: "Price updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await knex("products").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await knex("products").where({ id }).update({
      stock,
      updated_at: knex.fn.now(),
    });
    return res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updatetax = async (req, res) => {
  try {
    const { id } = req.params;
    const { tax } = req.body;
    const product = await knex("products").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const price = product.original_price;
    const discount = product.discount;
    const discountedPrice = price - (price * discount) / 100;
    const taxAmount = (discountedPrice * tax) / 100;
    const current_price = discountedPrice + taxAmount;
    await knex("products")
      .where({ id })
      .update({ tax, current_price, updated_at: knex.fn.now() });

    return res.status(200).json({ message: "Tax updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updatediscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;
    const product = await knex("products").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const price = product.original_price;
    const tax = product.tax;
    const discountedPrice = price - (price * discount) / 100;
    const taxAmount = (discountedPrice * tax) / 100;
    const current_price = discountedPrice + taxAmount;
    await knex("products")
      .where({ id })
      .update({ discount, current_price, updated_at: knex.fn.now() });
    return res.status(200).json({ message: "Discount updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  viewProducts,
  updateProduct,
  pricechange,
  updateStock,
  updatetax,
  updatediscount,
};
