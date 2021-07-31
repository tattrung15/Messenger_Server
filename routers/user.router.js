const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  getAllUsers,
  createNewUser,
  getUserById,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");

// router.use(asyncMiddleware(authMiddleware));

// router
//   .route("")
//   .get(asyncMiddleware(getAllUsers))
//   .post(asyncMiddleware(createNewUser));

router
  .route("/:userId")
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getUserById))
  .patch(asyncMiddleware(authMiddleware), asyncMiddleware(editUser))
  .delete(asyncMiddleware(authMiddleware), asyncMiddleware(deleteUser));

module.exports = router;
