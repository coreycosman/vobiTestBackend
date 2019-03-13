// IMPORTS:

// Library:
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// Local:

require("./config/config");

// ___________________________

// HTTP SERVER
const app = express();
// ___________________________

// MONGOOSE CONFIG:
const { mongoose } = require("./db/mongoose");
console.log(process.env.MONGODB_URI);

// ___________________________

// MIDDLEWARE:

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));
// ___________________________

// ROUTER CONFIG:

const router = require("./router/root");
router(app);

// ___________________________

// PORT CONFIG:

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`connected on port ${port}`);
});

// ___________________________

// EXPORTS:

module.exports = { app };
