const express = require("express");
const app = express();
const routes = require("./routes/auth");
const path = require("path");
const router1 = require("./routes/upload");
const route = require("./routes/product");
const router = require("./routes/cart");
const Routers = require("./routes/order");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);
app.use("/api", router1);
app.use("/admin", route);
app.use("/cart", router);
app.use("/order", Routers);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
