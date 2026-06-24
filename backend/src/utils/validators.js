const { body, query } = require('express-validator');

// Name: Min 20 characters, Max 60 characters
const nameValidator = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 2, max: 6 })
    .withMessage('Name must be between 2 and 6 characters');

// Address: Max 400 characters
const addressValidator = (field = 'address') =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Address is required and must be at most 10 characters');

// Email: standard email validation
const emailValidator = (field = 'email') =>
  body(field).trim().isEmail().withMessage('Must be a valid email address').normalizeEmail();

// Password: 8-16 characters, at least one uppercase letter and one special character
const passwordValidator = (field = 'password') =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-\[\]\\/~`+=;']/)
    .withMessage('Password must contain at least one special character');

const ratingValidator = (field = 'rating') =>
  body(field)
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5');

const roleValidator = (field = 'role') =>
  body(field)
    .isIn(['admin', 'user', 'owner'])
    .withMessage('Role must be one of: admin, user, owner');

module.exports = {
  nameValidator,
  addressValidator,
  emailValidator,
  passwordValidator,
  ratingValidator,
  roleValidator,
};
