const express = require("express");
const route = express.Router();
const admin = require("../Middleware/authAdmin");
const {
  addProduct,
  deleteProduct,
  viewProducts,
  updateProduct,
  pricechange,
  updateStock,
  updatediscount,
  updatetax,
} = require("../controllers/product");
const upload = require("../Middleware/multer");

route.post("/addproduct", admin, upload.single("image"), addProduct);
route.post("/deleteproduct", admin, deleteProduct);
route.get("/product", admin, viewProducts);
route.put("/products/:id", admin, updateProduct);
route.patch("/price/:id", admin, pricechange);
route.patch("/stock/:id", admin, updateStock);
route.patch("/discount/:id", admin, updatediscount);
route.patch("/tax/:id", admin, updatetax);

module.exports = route;
