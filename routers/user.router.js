const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");

const {
  getAllUsers,
  createNewUser,
  getUserById,
} = require("../controllers/user.controller");

router
  .route("")
  .get(asyncMiddleware(getAllUsers))
  .post(asyncMiddleware(createNewUser));

router.route("/:userId").get(asyncMiddleware(getUserById));

module.exports = router;
