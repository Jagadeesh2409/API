const express = require("express");
const app = express();
const route = require("./routes/product");
const router = require("./routes/cart");
const path = require("path");

app.use(
  "/product_images",
  express.static(path.join(__dirname, "product_images"))
);

app.use(express.urlencoded());
app.use(express.json());

app.use("/admin", route);
app.use("/cart", router);

app.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000");
});

const routes = require("./routes/auth");
const router1 = require("./routes/upload");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);
app.use("/api", router1);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
