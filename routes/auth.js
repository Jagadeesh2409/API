const express = require("express");
const router = express.Router();
const {
  login,
  register,
  resetPassword,
} = require("../controllers/authController");
const authentication = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", authentication, resetPassword);

module.exports = router;
