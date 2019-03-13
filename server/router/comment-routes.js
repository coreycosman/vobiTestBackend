const express = require("express");
const passport = require("passport");
const router = express.Router();

const passportService = require("../services/passport");

// MIDDLEWARE:
const requireAuth = passport.authenticate("jwt", { session: false });
const { validate } = require("../models/Comment");
const {
  createComment,
  fetchAllComments
} = require("../controllers/comments-controller");

router
  .route("/")
  .get(requireAuth, fetchAllComments)
  .post(requireAuth, validate("create"), createComment);

module.exports = router;
