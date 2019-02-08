const Validator = require('validator');
const isEmpty = require( "./is-empty");

module.exports = function validateLoginInput(formData, verifyError) {
  let errors = {}

  // ensure empty string if empty
  formData.email = !isEmpty(formData.email) ? formData.email : '';
  formData.password = !isEmpty(formData.password) ? formData.password : '';

  // email validations
  if (Validator.isEmpty(formData.email)) {
    errors.email = 'email field is required'
  }

  // password validations
  if (Validator.isEmpty(formData.password)) {
    errors.password = 'password field is required'
  }

  if (verifyError.email) {
    errors.email = verifyError.email
  }

  if (verifyError.password) {
    errors.password = verifyError.password
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
