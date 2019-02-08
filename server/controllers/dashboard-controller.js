const { User } = require('../models/user');

exports.dashboard = (req, res, next) => {
  res.json(req.user)
}
