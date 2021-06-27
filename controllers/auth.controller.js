const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const configuration = require("../configs/configuration");

const User = require("../models/User.model");

const { HttpStatus, ResponseEntity } = require("../dto/dataResponse");

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new ResponseEntity(HttpStatus.BAD_REQUEST, "Invalid username"));
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new ResponseEntity(HttpStatus.BAD_REQUEST, "Invalid password"));
  }

  const token = jwt.sign({ username }, configuration().JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(HttpStatus.OK).json({
    jwt: token,
    userId: user._id,
    username,
    displayname: user.displayname,
  });
};

module.exports.validateToken = async (req, res) => {
  const token = req.body.jwt;

  const user = jwt.verify(token, configuration().JWT_SECRET);

  const currentUser = await User.findOne({ username: user.username });

  if (!currentUser) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Invalid token"));
  }

  const newToken = jwt.sign(
    { username: currentUser.username },
    configuration().JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.status(HttpStatus.OK).json({
    jwt: newToken,
    userId: currentUser._id,
    username: currentUser.username,
    displayname: currentUser.displayname,
  });
};
