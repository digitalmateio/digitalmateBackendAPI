const Validator = require('validator');
const isEmpty = require( "./is-empty");

module.exports = function validateRegisterInput(data, e) {
  let errors = {}

  // ensure empty string if empty
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmation = !isEmpty(data.confirmation) ? data.confirmation : '';

  // email validations
  if (!Validator.isEmail(data.email)) {
    errors.email = 'invalid email'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required'
  }
  if (e.name === 'MongoError' && e.code === 11000) {
    errors.email = 'email in use'
  }

  // password validations
  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'password must be between 8 and 30 characters'
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'password field is required'
  }

  // password confirmation validations
  if (!Validator.equals(data.password, data.confirmation)) {
    errors.confirmation = 'password confirmation does not match password'
  }
  if (Validator.isEmpty(data.confirmation)) {
    errors.confirmation = 'password confirmation field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
