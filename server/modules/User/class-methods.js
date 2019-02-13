const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmpty = require('../../validation/is-empty');

module.exports = UserSchema => {
  UserSchema.statics.verifyLogin = function(email, password) {
    return new Promise((resolve, reject) => {
      if (isEmpty(email)) reject('');
      this.findOne({ email })
        .then(user => {
          if (!user) {
            reject({ email: 'email not found' });
          } else if (isEmpty(password)) {
            reject('');
          } else {
            bcrypt
              .compare(password, user.password)
              .then(isMatch => {
                isMatch
                  ? resolve(user)
                  : reject({ password: 'password incorrect' });
              })
              .catch(e => console.log(e));
          }
        })
        .catch(e => console.log(e));
    });
  };
};
