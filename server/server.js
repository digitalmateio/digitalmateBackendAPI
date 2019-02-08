// IMPORTS:
// Library:
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Local

require("./config/config");

// ___________________________

// Server Setup
const app = express();
// ___________________________

// MONGOOSE CONFIG:
const { mongoose } = require("./db/mongoose");
console.log(process.env.MONGODB_URI);

// CONTROLLER CONFIG:
const todosController = require("./controllers/todos-controller");
const usersController = require("./controllers/users-controller");

const router = require("./router/root");
router(app);
// const { testeroni } = require("./controllers/tests-controllers");
// const testRoute = require("./router/test-route");
// console.log(testRoute);
// const router = express.Router();

// router.route("/test").get(testeroni);
// app.use("/test", testRoute);
// ___________________________

// MIDDLEWARE:
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ___________________________

// PORT:

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`connected on port ${port}`);
});

// ___________________________

// EXPORTS:

module.exports = { app };

// ___________________________
