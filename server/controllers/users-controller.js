const { User } = require("../models/user");
const _ = require("lodash");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

module.exports = {
  signup: async (req, res, next) => {
    const body = _.pick(req.body, ["email", "password", "confirmation"]);
    try {
      const newUser = new User(body);
      newUser.generateAuthToken();
      const savedUser = await newUser.save();
      res.json(savedUser.auth.token);
    } catch (e) {
      let { errors, isValid } = validateRegisterInput(body, e);
      if (!isValid) {
        return res.status(400).json(errors);
      } else {
        return res.status(500).json("please try again");
      }
    }
  },

  login: async (req, res, next) => {
    let body = _.pick(req.body, ["email", "password"]);
    let user = await User.verifyLogin(body.email, body.password);
    console.log(user);
    let token = user.generateAuthToken();
    try {
      user.update({
        $set: {
          auth: {
            token
          }
        }
      });
      res.json(token);
    } catch (e) {
      console.log(e);
    }
  }
};

// exports.signup = (req, res, next) => {
//   const body = _.pick(req.body, ["email", "password", "confirmation"]);
//   const newUser = new User(body);
//   newUser.generateAuthToken();
//   newUser
//     .save()
//     .then(user => res.json(user.auth.token))
//     .catch(e => {
//       let { errors, isValid } = validateRegisterInput(body, e);
//       if (!isValid) {
//         return res.status(400).json(errors);
//       } else {
//         return res.status(500).json("please try again");
//       }
//     });
// };
//
// exports.login = (req, res, next) => {
//   let body = _.pick(req.body, ["email", "password"]);
//   User.verifyLogin(body.email, body.password)
//     .then(user => {
//       console.log(user);
//       let token = user.generateAuthToken();
//       user
//         .update({
//           $set: {
//             auth: {
//               token
//             }
//           }
//         })
//         .then(() => res.json(token))
//         .catch(e => {
//           console.log(e);
//         });
//     })
//     .catch(verifyError => {
//       let { errors, isValid } = validateLoginInput(body, verifyError);
//       if (!isValid) {
//         return res.status(400).json(errors);
//       }
//     });
// };

// ________________________________________________________________________
// WITHOUT PASSPORT:

//   // const {authenticate} = require('../middleware/authenticate');

//  POST /USERS:

// exports.signup = (req, res, next) => {
//   const body = _.pick(req.body, ['email', 'password'])
//   const newUser = new User(body);
//   newUser.generateAuthToken();
//   newUser.save()
//     .then(user => res.json(user.tokens[0].token))
//     .catch(e => res.status(400).send(e))
// }

// // GET /users/me (PRIVATE)
//
//   app.get('/users/me', authenticate, (req, res) => {
//     var userName = req.user
//     res.render(views + '/user', {name : userName});
//   });

// // POST /users/login
//   app.post('/users/login', (req, res) => {
//     body = _.pick(req.body, ['email', 'password']);
//     User.findByCredentials(body.email, body.password).then((user) => {
//       return user.generateAuthToken().then((token) => {
//         res.header('x-auth', token).send(user);
//       })
//     }).catch((e) => {
//       res.status(400).send();
//     })
//   });

// // DELETE /users/me/token
//   app.delete('/users/me/token', authenticate, (req, res) => {
//     req.user.removeToken(req.token).then(() => {
//       res.status(200).send();
//     }), () => {
//       res.satus(400).send();
//     }
//   });
// }
