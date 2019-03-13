// POST MODEL:

const mongoose = require("mongoose"),
  Joi = require("joi"),
  { generateUniqueId } = require("../modules/helpers/unique-id"),
  // Define schema objects and errors with Joi
  title = Joi.string()
    .required()
    .trim()
    .error(errors => {
      const titleErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "please include a post title" };
          default:
            return;
        }
      });
      return titleErrorsArray;
    }),
  description = Joi.string()
    .required()
    .trim()
    .error(errors => {
      const descriptErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "please include a post description" };
          default:
            return;
        }
      });
      return descriptErrorsArray;
    }),
  userId = Joi.object(),
  userName = Joi.string(),
  createdAt = Joi.date().required(),
  updatedAt = Joi.date().required(),
  // Plug Mongoose into Joigoose

  Joigoose = require("joigoose")(mongoose),
  // Define joi schema and specific validation schemas

  joiPostSchema = Joi.object()
    .keys({
      title,
      description,
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
        title,
        description
      })
      .required()
  },
  // Convert Joi Schema into Mongoose Schema

  PostSchema = new mongoose.Schema(Joigoose.convert(joiPostSchema));

// Import post middleware
// require("../modules/Post/before-actions")(PostSchema);
// require("../modules/Post/instance-methods")(PostSchema);
// require("../modules/Post/class-methods")(PostSchema);

// Define Mongoose Schema

const Post = mongoose.model("Post", PostSchema);

module.exports = {
  Post,
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
