const knex = require("../db/knex");
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
const makeOrder = async (req, res) => {
  const user_id = req.user.id;
  const { quantity, total_price, products } = req.body;
  const year = new Date().getFullYear();

  const innovoiceGen = (orderId) => {
    return `INV-${year}-${String(orderId).padStart(5, "0")}`;
  };

  try {
    // Validate request
    const shipping_address = await knex("user_addresses")
      .where({ user_id })
      .first();

    if (
      !user_id ||
      !shipping_address ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Get next invoice number
    const lastOrder = await knex("orders").orderBy("id", "desc").first();
    const currentYear = new Date().getFullYear();

    let nextId;

    if (!lastOrder) {
      nextId = 1;
    } else {
      const lastOrderYear = new Date(lastOrder.created_at).getFullYear();
      nextId = lastOrderYear === currentYear ? lastOrder.id + 1 : 1;
    }

    // Insert into orders table
    const [orderId] = await knex("orders").insert({
      inovoice_no: innovoiceGen(nextId),
      user_id,
      quantity,
      total_price,
    });

    const newOrderId = orderId;

    // Helper to get product price
    const getPrice = async (id) => {
      const data = await knex("products").where({ id }).first();
      return data.price;
    };

    // Prepare order_items
    const items = [];
    for (const ele of products) {
      const { id, quantity } = ele;
      const price = await getPrice(id);
      const total = quantity * price;

      items.push({
        product_id: id,
        quantity,
        price,
        total,
        order_id: newOrderId,
      });
    }

    // Insert order_items
    await knex("order_items").insert(items);

    return res.status(200).json({
      message: "Order placed successfully",
      invoice: innovoiceGen(nextId),
      order_id: newOrderId,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(500).json({ message: error.message });
  }
};

const setAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone_number,
      is_default,
    } = req.body;
    const data = {
      user_id,
      name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone_number,
      is_default,
    };
    const fields = Object.values(data).some((value) => !value);
    if (!fields) {
      return res
        .status(200)
        .json({ message: "require all the fields to place orders" });
    }
    await knex("user_addresses").insert(data);

    return res.status(200).json({ message: "address added" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { setAddress, makeOrder };
