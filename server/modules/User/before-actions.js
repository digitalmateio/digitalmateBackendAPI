const bcrypt = require('bcryptjs');

module.exports = UserSchema => {
  UserSchema.pre('save', function(next) {
    if (this.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }

          this.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
};
