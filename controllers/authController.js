const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const knex = require("../db/knex");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "require all the fields" });
  }
  const existingUser = await knex("accounts").where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ message: "user already exist" });
  }

  const salt = parseInt(process.env.SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);

  await knex("accounts").insert({ name, email, password: hashedPassword });

  return res.status(200).json({ message: "user successfully registered" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "require all the fields" });
  }
  try {
    const user = await knex("accounts").where({ email }).first();
    if (!user) {
      return res
        .status(400)
        .json({ message: "username or password incorrect" });
    }
    const verify = bcrypt.compare(password, user.password);
    if (!verify) {
      return res
        .status(400)
        .json({ message: "username or password incorrect" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ message: "user succesfully login", token });
  } catch (err) {
    return res.status(500).json({ message: "you haven't account" });
  }
};

const resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "require all the fields" });
  }
  try {
    const user = await knex("accounts").where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    const verify = await bcrypt.compare(oldPassword, user.password);
    if (!verify) {
      return res.status(400).json({ message: "old password is incorrect" });
    }
    const salt = parseInt(process.env.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await knex("accounts")
      .where({ email })
      .update({ password: hashedPassword });
    return res.status(200).json({ message: "password successfully updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const id = req.user.id;
    const data = await knex("accounts").where({ id });

    return res.status(200).json({ message: data });
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};

module.exports = { register, login, profile, resetPassword };
