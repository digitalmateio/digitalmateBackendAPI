const { User } = require('../models/User');
const _ = require('lodash');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

module.exports = {
  signup: async (req, res, next) => {
    const body = _.pick(req.body, ['email', 'password', 'confirmation']);
    try {
      const newUser = new User(body);
      // newUser.generateAuthToken();
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        res.status(400).json({ error: 'email in use' });
      } else {
        console.log(e);
        res.status(500).json({ error: 'please try again' });
      }
    }
  },
  // signup: async (req, res, next) => {
  //   const body = _.pick(req.body, ['email', 'password', 'confirmation']);
  //   try {
  //     const newUser = new User(body);
  //     newUser.generateAuthToken();
  //     const savedUser = await newUser.save();
  //     res.json(savedUser.auth.token);
  //   } catch (e) {
  //     let { errors, isValid } = validateRegisterInput(body, e);
  //     if (!isValid) {
  //       return res.status(400).json(errors);
  //     } else {
  //       console.log(e);
  //       return res.status(500).json('please try again');
  //     }
  //   }
  // },

  login: async (req, res, next) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = await User.verifyLogin(body.email, body.password);
    console.log(user);
    let token = user.generateAuthToken();
    try {
      user.update({
        $set: {
          auth: {
            token,
          },
        },
      });
      user.save();
      res.json(token);
    } catch (e) {
      console.log(e);
    }
  },
};
