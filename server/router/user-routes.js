const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/users-controller");

module.exports = express => {
  const router = express.Router();

  router.route("/users").post(signup);
  router.route("/users/login").post(login);
};
