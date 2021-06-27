const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");

const { login, validateToken } = require("../controllers/auth.controller");

router.route("/login").post(asyncMiddleware(login));

router.route("/validate").post(asyncMiddleware(validateToken));

module.exports = router;
