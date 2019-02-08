const passport =  require('passport');
const { User } = require('../models/user');
const { Strategy, ExtractJwt } = require('passport-jwt');

// Auth Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .then(user => {
      if (user) {
        done(null, user);
      }
      return done(null, false);
    })
    .catch(e => {
      return done(e, false)
    })
});

passport.use(jwtLogin);







// ______________________________________________________________________
// Local Strategy
// const LocalStrategy = require('passport-local');
// const localOptions = { usernameField: 'email' };
// const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
//
//   User.findOne({ email }, (err, user) => {
//     if (err) { return done(err) }
//     if (!user) { return done(null, false) }
//
//     user.comparePassword(password, (err, isMatch) => {
//       if (err) { return done(err) }
//       if(!isMatch) { return done(null, false) }
//
//       return done(null, user);
//     });
//   });
// });
