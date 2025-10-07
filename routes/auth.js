const express = require("express");
const router = express.Router();
const {
  login,
  register,
  profile,
  resetPassword,
} = require("../controllers/authController");
const authentication = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authentication, profile);
router.post("/reset-password", authentication, resetPassword);

module.exports = router;
