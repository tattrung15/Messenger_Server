const User = require("../models/User.model");

const { ResponseEntity, HttpStatus, Message } = require("../dto/dataResponse");

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users.length) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .json(new ResponseEntity(HttpStatus.NO_CONTENT, Message.NO_CONTENT));
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, users));
};

module.exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(
        new ResponseEntity(
          HttpStatus.NOT_FOUND,
          `User not found by id: ${userId}`
        )
      );
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

module.exports.createNewUser = async (req, res) => {
  const user = new User(req.body);

  const newUser = await user.save();

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, newUser));
};

module.exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const userBody = { ...req.body };

  if (userBody.username) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        new ResponseEntity(HttpStatus.BAD_REQUEST, "Cannot change username")
      );
  }

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(new ResponseEntity(HttpStatus.NOT_FOUND, Message.ERROR));
  }

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

module.exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndDelete({ _id: userId }).select("-password");

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};
