const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...Data } = user._doc;
    console.log(user._doc);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(Data);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password, ...data } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(data);
    } else {
      res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
module.exports = {
  register,
  login,
  logout,
};
