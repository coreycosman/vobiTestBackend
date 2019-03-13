const express = require("express");
const passport = require("passport");
const router = express.Router();

const passportService = require("../services/passport");

// MIDDLEWARE:
const requireAuth = passport.authenticate("jwt", { session: false });
const { validate } = require("../models/User");
const { signup, login } = require("../controllers/users-controller");

router.route("/").post(validate("auth"), signup);
router.route("/login").post(validate("login"), login);

module.exports = router;
