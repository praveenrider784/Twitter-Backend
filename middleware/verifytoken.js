const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verify = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        req.user = await User.findById(decoded.id);
        next();
      } else {
        return res.status(401).send({
          type: "error",
          msg: "Invalid Token.",
        });
      }
    } catch (err) {
      return res.status(401).send({
        type: "error",
        msg: "Token verification failed. Please log in again.",
      });
    }
  } else {
    res
      .status(401)
      .send({
        type: "error",
        msg: "Authentication token is missing. Please log in.",
      });
  }
};

module.exports = verify;
