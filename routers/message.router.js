const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  getMessagesByConversation,
} = require("../controllers/message.controller");

router.use(asyncMiddleware(authMiddleware));

router.route("").get(asyncMiddleware(getMessagesByConversation));

module.exports = router;
