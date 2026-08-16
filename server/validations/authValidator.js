const validate = require('../middleware/validate');

const registerRules = [
  { field: 'name', label: 'Full Name', required: true, min: 2 },
  { field: 'email', label: 'Email Address', required: true, type: 'email' },
  { field: 'phone', label: 'Phone Number', required: true, type: 'phone' },
  { field: 'password', label: 'Password', required: true, min: 6 }
];

const loginRules = [
  { field: 'email', label: 'Email Address', required: true, type: 'email' },
  { field: 'password', label: 'Password', required: true }
];

const profileRules = [
  { field: 'name', label: 'Full Name', required: false, min: 2 },
  { field: 'email', label: 'Email Address', required: false, type: 'email' },
  { field: 'phone', label: 'Phone Number', required: false, type: 'phone' },
  { field: 'password', label: 'Password', required: false, min: 6 }
];

const forgotPasswordRules = [
  { field: 'email', label: 'Email Address', required: true, type: 'email' }
];

const resetPasswordRules = [
  { field: 'password', label: 'New Password', required: true, min: 6 }
];

module.exports = {
  validateRegister: validate(registerRules),
  validateLogin: validate(loginRules),
  validateProfile: validate(profileRules),
  validateForgot: validate(forgotPasswordRules),
  validateReset: validate(resetPasswordRules)
};
