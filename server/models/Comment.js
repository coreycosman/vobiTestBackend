// COMMENT MODEL:
const mongoose = require("mongoose"),
  Joi = require("joi"),
  { generateUniqueId } = require("../modules/helpers/unique-id"),
  // Define schema objects and errors with Joi
  text = Joi.string()
    .required()
    .trim()
    .error(errors => {
      const textErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "please include comment text" };
          default:
            return;
        }
      });
      return textErrorsArray;
    }),
  formPostId = Joi.string(),
  postId = Joi.object().required(),
  userId = Joi.object().required(),
  userName = Joi.string().required(),
  createdAt = Joi.date().required(),
  updatedAt = Joi.date().required(),
  // Plug Mongoose into Joigoose

  Joigoose = require("joigoose")(mongoose),
  // Define joi schema and specific validation schemas

  joiCommentSchema = Joi.object()
    .keys({
      text,
      postId,
      userId,
      userName,
      createdAt,
      updatedAt
    })
    .required(),
  validationSchemas = {
    create: Joi.object()
      .options({ abortEarly: false })
      .keys({
        text,
        formPostId
      })
      .required()
  },
  // Convert Joi Schema into Mongoose Schema

  CommentSchema = new mongoose.Schema(Joigoose.convert(joiCommentSchema));

// Import Comment middleware
// require("../modules/Comment/before-actions")(CommentSchema);
// require("../modules/Comment/instance-methods")(CommentSchema);
// require("../modules/Comment/class-methods")(CommentSchema);

// Define Mongoose Schema

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {
  Comment,
  validate: schemaType => (req, res, next) => {
    const result = Joi.validate(req.body, validationSchemas[schemaType]);
    let errorsArray = [];
    if (result.error) {
      result.error.details.forEach(err => {
        errorsArray.push({ id: generateUniqueId(), errMessage: err.message });
      });
      return res.status(400).json({ errors: errorsArray });
    }
    if (!req.value) req.value = {};
    req.value["body"] = result.value;
    next();
  }
};
