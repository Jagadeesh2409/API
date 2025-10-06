const knex = require("../db/knex");
const addToCart = async (req, res) => {
  try {
    console.log(req.user);
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cartItem = await knex("cart").where({ user_id, product_id }).first();

    if (cartItem) {
      await knex("cart")
        .where({ id: cartItem.id })
        .update({
          quantity: cartItem.quantity + quantity,
          updated_at: knex.fn.now(),
        });
    } else {
      await knex("cart").insert({
        user_id,
        product_id,
        quantity,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });
    }

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id;

    if (!user_id) return res.status(400).json({ message: "User ID required" });

    const deleted = await knex("cart")
      .where({ user_id, product_id: productId })
      .del();

    if (deleted) {
      res.status(200).json({ message: "Product removed from cart" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await knex("cart")
      .join("products", "cart.product_id", "products.id")
      .leftJoin("products_img", "products.id", "products_img.product_id")
      .where("cart.user_id", userId)
      .groupBy("cart.id", "products.id")
      .select(
        "cart.id as cart_id",
        "products.id as product_id",
        "products.name",
        "products.price",
        "cart.quantity",
        knex.raw(
          "COALESCE(GROUP_CONCAT(products_img.url SEPARATOR ','), '') as images"
        )
      );
    if (!cartItems) {
      res.status(300).json({ cart: "cart is empty" });
    }

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const emptyCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }
    await knex("cart").where({ user_id }).del();
    res.status(200).json({ message: "Cart emptied successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const reduceQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }
    const cartItem = await knex("cart")
      .where({ user_id, product_id: productId })
      .first();
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (cartItem.quantity > 1) {
      await knex("cart")
        .where({ id: cartItem.id })
        .update({ quantity: cartItem.quantity - 1, updated_at: knex.fn.now() });
      return res.status(200).json({ message: "Product quantity reduced by 1" });
    }
    await knex("cart").where({ id: cartItem.id }).del();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  emptyCart,
  reduceQuantity,
};
