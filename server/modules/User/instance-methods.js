const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = UserSchema => {
  UserSchema.methods.generateAuthToken = function() {
    const access = "authenticated";
    const timestamp = Math.floor(Date.now() / 1000);
    const token = jwt
      .sign(
        {
          sub: this.id,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: timestamp
        },
        process.env.JWT_SECRET
      )
      .toString();

    return token;
  };

  UserSchema.methods.removeToken = function() {
    return this.update({
      $set: {
        auth: {
          token: "",
          access: "unauthorized"
        }
      }
    });
    this.update();
  };

  UserSchema.methods.comparePasswords = function(reqPassword) {
    return bcrypt.compare(reqPassword, this.password);
  };
};
