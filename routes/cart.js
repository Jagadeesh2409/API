const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
  emptyCart,
  reduceQuantity,
} = require("../controllers/cart");

const authentication = require("../Middleware/authMiddleware");

router.post("/add", authentication, addToCart);
router.delete("/remove/:productId", authentication, removeFromCart);
router.get("/:userId", authentication, getCart);
router.delete("/empty/:userId", authentication, emptyCart);
router.patch("/reduce/:productId", authentication, reduceQuantity);

module.exports = router;
