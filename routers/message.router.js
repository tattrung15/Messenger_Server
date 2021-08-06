const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  getMessagesByConversation,
} = require("../controllers/message.controller");

router
  .route("")
  .get(
    asyncMiddleware(authMiddleware),
    asyncMiddleware(getMessagesByConversation)
  );

module.exports = router;
