const express = require("express");
const passport = require("passport");
const router = express.Router();

const passportService = require("../services/passport");

// MIDDLEWARE:
const requireAuth = passport.authenticate("jwt", { session: false });

const { validate } = require("../models/Post");
const {
  fetchAllPosts,
  fetchUserPosts,
  createPost,
  fetchPost,
  updatePost,
  deletePost
} = require("../controllers/posts-controller");

router
  .route("/")
  .post(requireAuth, validate("create"), createPost)
  .get(requireAuth, fetchAllPosts);
router.route("/user").get(requireAuth, fetchUserPosts);
router
  .route("/:id")
  .post(requireAuth, fetchPost)
  .delete(requireAuth, deletePost)
  .patch(requireAuth, validate("create"), updatePost);

module.exports = router;
