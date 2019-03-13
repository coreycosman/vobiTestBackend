const _ = require("lodash"),
  { User } = require("../models/User"),
  { generateUniqueId } = require("../modules/helpers/unique-id"),
  serverError = require("../modules/helpers/server-error");

module.exports = {
  signup: async (req, res, next) => {
    const resBody = _.pick(req.body, [
      "email",
      "password",
      "confirmation",
      "firstName",
      "lastName"
    ]);
    // check password and confirmation match
    if (resBody.password != resBody.confirmation) {
      return res.status(400).json({
        errors: [
          { id: generateUniqueId(), errMessage: "please confirm password" }
        ]
      });
    }
    // check email uniqueness
    const checkEmail = await User.checkEmail(resBody.email);
    if (checkEmail) {
      return res.status(400).json({
        errors: [{ id: generateUniqueId(), errMessage: "email in use" }]
      });
    }
    try {
      const userBody = _.pick(resBody, [
          "email",
          "password",
          "firstName",
          "lastName"
        ]),
        newUser = new User(userBody),
        token = newUser.generateAuthToken();
      await newUser.save();
      res.status(200).json(token);
    } catch (e) {
      console.log(e);
      serverError(res);
    }
  },

  login: async (req, res, next) => {
    const body = _.pick(req.body, ["email", "password"]),
      // check email is registered
      user = await User.checkEmail(body.email);
    if (!user) {
      return res.status(400).json({
        errors: [{ id: generateUniqueId(), errMessage: "email not found" }]
      });
    }
    // check passwords match
    const checkPasswords = await user.comparePasswords(body.password);

    if (!checkPasswords) {
      return res.status(400).json({
        errors: [{ id: generateUniqueId(), errMessage: "incorrect password" }]
      });
    }
    try {
      const token = user.generateAuthToken();
      return res.status(200).json(token);
    } catch (e) {
      console.log(e);
      serverError(res);
    }
  }
};
