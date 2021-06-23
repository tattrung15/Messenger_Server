const express = require("express");

const router = express.Router();

const asyncMiddleware = require("../middlewares/async.middleware");

const { login } = require("../controllers/auth.controller");

router.route("/login").post(asyncMiddleware(login));

module.exports = router;
