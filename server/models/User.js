// USER MODEL:

const mongoose = require("mongoose"),
  { generateUniqueId } = require("../modules/helpers/unique-id"),
  Joi = require("joi"),
  // Define schema objects and errors with Joi
  email = Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .error(errors => {
      const emailErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "email must be present" };
          case "string.email":
            return { message: "invalid email format" };
          default:
            return;
        }
      });
      // Removes duplicates in email errors array
      // NOTE: export as helper function
      const uniqueErrors = (array, prop) => {
        let uniqueArray = [];
        let uniqueErrorsObj = {};

        array.forEach(error => {
          uniqueErrorsObj[error[prop]] = error;
        });

        for (errorKey in uniqueErrorsObj) {
          uniqueArray.push(uniqueErrorsObj[errorKey]);
        }
        return uniqueArray;
      };
      return uniqueErrors(emailErrorsArray, "message");
    }),
  password = Joi.string()
    .min(8)
    .required()
    .error(errors => {
      const passwordErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "password must be present" };
          case "string.min":
            return { message: "password must be at least 8 characters" };
          default:
            return;
        }
      });
      return passwordErrorsArray;
    }),
  confirmation = Joi.string()
    .min(8)
    .required()
    .error(errors => {
      const confirmationErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "confirmation must be present" };
          case "string.min":
            return { message: "confirmation must be at least 8 characters" };
          default:
            return;
        }
      });
      return confirmationErrorsArray;
    }),
  firstName = Joi.string()
    .required()
    .error(errors => {
      const firstNameErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "first name must be present" };
          default:
            return;
        }
      });
      return firstNameErrorsArray;
    }),
  lastName = Joi.string()
    .required()
    .error(errors => {
      const lastNameErrorsArray = errors.map(err => {
        switch (err.type) {
          case "any.empty":
            return { message: "last name must be present" };
          default:
            return;
        }
      });
      return lastNameErrorsArray;
    }),
  // Plug Mongoose into Joigoose

  Joigoose = require("joigoose")(mongoose),
  // Define joi schema and specific validation schemas

  joiUserSchema = Joi.object()
    .keys({
      email,
      password,
      firstName,
      lastName
    })
    .required(),
  validationSchemas = {
    auth: Joi.object()
      .options({ abortEarly: false })
      .keys({
        email,
        password,
        confirmation,
        firstName,
        lastName
      })
      .required(),
    login: Joi.object()
      .options({ abortEarly: false })
      .keys({
        email,
        password
      })
      .required()
  },
  // Convert Joi Schema into Mongoose Schema

  UserSchema = new mongoose.Schema(Joigoose.convert(joiUserSchema));

// Import user middleware
require("../modules/User/before-actions")(UserSchema);
require("../modules/User/instance-methods")(UserSchema);
require("../modules/User/class-methods")(UserSchema);

// Define Mongoose Schema

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
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
