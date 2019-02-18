// USER MODEL:

// NOTE: use const for everything here for readablity
// NOTE: add other mongoose elements to joi schema
// NOTE: confirmation doesnt need to be stored - can be checked on frontend, research this
const mongoose = require('mongoose'),
  Joi = require('joi'),
  email = Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .error(errors => {
      const emailErrorsArray = errors.map(err => {
        switch (err.type) {
          case 'any.empty':
            return { message: 'email must be present' };
          case 'string.email':
            return { message: 'invalid email format' };
          default:
            return;
        }
      });
      // remove duplicates in email errors array
      // NOTE: export as helper function
      const uniqueErrors = (array, prop) => {
        let uniqueArray = [];
        let uniqueErrorsObj = {};

        array.forEach(error => {
          uniqueErrorsObj[error[prop]] = error;
        });

        for (errorKey in uniqueErrorsObj) {
          uniqueArray.push(uniqueErrorsObj[errorKey]);
        }
        return uniqueArray;
      };
      return uniqueErrors(emailErrorsArray, 'message');
    }),
  password = Joi.string()
    .min(8)
    .error(errors => {
      const passwordErrorsArray = errors.map(err => {
        switch (err.type) {
          case 'any.empty':
            return { message: 'password must be present' };
          case 'string.min':
            return { message: 'password must be at least 8 characters' };
          default:
            return;
        }
      });
      return passwordErrorsArray;
    }),
  confirmation = Joi.string()
    .min(8)
    .error(errors => {
      const confirmationErrorsArray = errors.map(err => {
        switch (err.type) {
          case 'any.empty':
            return { message: 'confirmation must be present' };
          case 'string.min':
            return { message: 'confirmation must be at least 8 characters' };
          default:
            return;
        }
      });
      return confirmationErrorsArray;
    }),
  Joigoose = require('joigoose')(mongoose),
  joiUserSchema = Joi.object()
    // .options({ abortEarly: false })
    .keys({
      email: email.required(),
      password: password.required(),
      confirmation: confirmation.required(),
    })
    .required(),
  validationSchemas = {
    signup: Joi.object()
      .options({ abortEarly: false })
      .keys({
        email,
        password: password.required(),
      })
      .required(),
  },
  UserSchema = new mongoose.Schema(Joigoose.convert(joiUserSchema));

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
    let errorsArray = [];
    if (result.error) {
      result.error.details.forEach(err => {
        errorsArray.push(err.message);
      });
      return res.status(400).json({
        error: errorsArray,
      });
    }
    if (!req.value) req.value = {};
    req.value['body'] = result.value;
    next();
  },
};
