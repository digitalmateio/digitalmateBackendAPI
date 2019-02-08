const express = require("express");
const router = express.Router();
const { testeroni } = require("../controllers/tests-controllers");

router.route("/").get(testeroni);

module.exports = router;
