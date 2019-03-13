const { ObjectID } = require("mongodb");

const generateUniqueId = () => {
  return new ObjectID().toHexString();
};

module.exports = { generateUniqueId };
