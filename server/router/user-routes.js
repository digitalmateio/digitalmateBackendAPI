const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/users-controller');
const { validate } = require('../models/User');

router.route('/').post(validate('signup'), signup);
router.route('/login').post(login);

module.exports = router;
