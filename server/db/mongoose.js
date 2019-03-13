// ODM CONFIG
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .catch(e => {
    console.log("mongo connection error: try running mongod");
  });

module.exports = { mongoose };
