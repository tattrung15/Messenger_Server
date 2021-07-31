const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

const configuration = require("../configs/configuration");

const { HttpStatus, ResponseEntity } = require("../dto/dataResponse");

module.exports = async (req, res, next) => {
  const { userId } = req.params;

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  const token = authorization.substring(7);
  const { username } = jwt.verify(token, configuration().JWT_SECRET);

  const user = await User.findOne({ username });

  if (userId !== user._id.toString()) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  req.user = user;
  next();
};
