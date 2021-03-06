const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (err) {
    return res.status(400).send({ err: "authorization failed" });
  }
};
