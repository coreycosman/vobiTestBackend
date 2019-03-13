const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmpty = require("../../utils/is-empty");
const { generateUniqueId } = require("../helpers/unique-id");
const serverError = require("../helpers/server-error");

module.exports = UserSchema => {
  UserSchema.statics.checkEmail = function(email) {
    return this.findOne({ email });
  };
};
