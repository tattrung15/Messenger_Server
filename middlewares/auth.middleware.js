const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

const configuration = require("../configs/configuration");

const { HttpStatus, ResponseEntity } = require("../dto/dataResponse");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  const token = authorization.substring(7);
  const { username } = jwt.verify(token, configuration().JWT_SECRET);

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  req.user = user;
  next();
};
