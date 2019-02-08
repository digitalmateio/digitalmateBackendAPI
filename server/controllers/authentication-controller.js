const _ = require('lodash');
const { User } = require('../models/user');

exports.root = (req, res, next) => {
  res.render('../../public/views/enter')
}

exports.signup = (req, res, next) => {
  const body = _.pick(req.body, ['email', 'password'])
  const newUser = new User(body);
  newUser.generateAuthToken();
  newUser.save()
    .then(user => res.json(user.tokens[0].token))
    .catch(e => res.status(400).send(e))
}
