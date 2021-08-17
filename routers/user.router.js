const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { allowUserRouter } = require("../middlewares/role.middleware");

const {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");

router.use(asyncMiddleware(authMiddleware));

router.route("").get(asyncMiddleware(getAllUsers));

router
  .route("/:userId")
  .get(asyncMiddleware(allowUserRouter), asyncMiddleware(getUserById))
  .patch(asyncMiddleware(allowUserRouter), asyncMiddleware(editUser))
  .delete(asyncMiddleware(allowUserRouter), asyncMiddleware(deleteUser));

module.exports = router;
