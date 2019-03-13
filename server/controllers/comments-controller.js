const _ = require("lodash"),
  { User } = require("../models/User"),
  { Post } = require("../models/Post"),
  { Comment } = require("../models/Comment"),
  { ObjectId } = require("mongodb"),
  serverError = require("../modules/helpers/server-error");

module.exports = {
  fetchAllComments: async (req, res, next) => {
    try {
      const allComments = await Comment.find({});
      res.status(200).json({ allComments });
    } catch (e) {
      console.log(e);
      serverError(res);
    }
  },
  createComment: async (req, res, next) => {
    const commentBody = _.pick(req.body, ["text"]);
    try {
      // NOTE: postId datatype needs to be checked here or on pre middleware to ensure mongo Object ID
      const newComment = new Comment(commentBody);
      newComment.postId = ObjectId(req.body.formPostId);
      newComment.userId = req.user._id;
      newComment.userName = `${req.user.firstName} ${req.user.lastName}`;
      newCreated.createdAt = Date.now();
      newCreated.updatedAt = Date.now();
      newComment.save();
      res.status(200).json({ created: true });
    } catch (e) {
      console.log(e);
      serverError(res);
    }
  },
  updatePost: async (req, res, next) => {
    res.json({ hello: "hello" });
  },
  deletePost: async (req, res, next) => {
    res.json({ hello: "hello" });
  }
};
