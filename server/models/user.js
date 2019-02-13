// USER MODEL:

const mongoose = require('mongoose'),
  Joi = require('joi'),
  email = Joi.string()
    .email()
    .lowercase()
    .trim()
    .error(errors => {
      errors.message = 'test';
      return errors.message;
    }),
  // }),
  // .error(errors => {
  //   return (errors.message = 'test');
  // }),
  // .error(errors => {
  //   return {
  //     message: 'test',
  //   };
  // }),
  password = Joi.string()
    .min(8)
    .error(() => 'invalid password format'),
  confirmation = Joi.string()
    .min(8)
    .error(() => 'invalid password confirmation'),
  Joigoose = require('joigoose')(mongoose);

const joiUserSchema = Joi.object()
  // .options({ abortEarly: false })
  .keys({
    email: email.required(),
    password: password.required(),
    confirmation: confirmation.required(),
  })
  .required();

const validationSchemas = {
  signup: Joi.object()
    // .options({ abortEarly: false })
    .keys({
      email: email.required(),
      password: password.required(),
    })
    .required(),
};

const UserSchema = new mongoose.Schema(Joigoose.convert(joiUserSchema));

// const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     required: true,
//     unique: true,
//   },
//
//   password: {
//     type: String,
//     required: true,
//     minlength: 8,
//   },
//
//   confirmation: {
//     type: String,
//     required: true,
//     minlength: 8,
//   },
//
//   auth: {
//     token: {
//       type: String,
//       required: true,
//     },
//
//     access: {
//       type: String,
//       required: true,
//     },
//   },
// });

// imported user modules
require('../modules/User/before-actions')(UserSchema);
require('../modules/User/instance-methods')(UserSchema);
require('../modules/User/class-methods')(UserSchema);

const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
  validate: schemaType => (req, res, next) => {
    const result = Joi.validate(req.body, validationSchemas[schemaType]);
    if (result.error) {
      return res.status(400).json({
        error: result.error.message,
      });
    }
    if (!req.value) req.value = {};
    req.value['body'] = result.value;
    next();
  },
};
