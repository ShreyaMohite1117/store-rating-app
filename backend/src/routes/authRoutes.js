const express = require('express');
const router = express.Router();

const { signup, login, updatePassword, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');
const {
  nameValidator,
  emailValidator,
  addressValidator,
  passwordValidator,
} = require('../utils/validators');

// POST /api/auth/signup - Normal User self-registration
router.post(
  '/signup',
  [nameValidator(), emailValidator(), addressValidator(), passwordValidator()],
  validate,
  signup
);

// POST /api/auth/login - shared login for all roles
router.post(
  '/login',
  [emailValidator(), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

// PUT /api/auth/update-password - any authenticated role
router.put(
  '/update-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    passwordValidator('newPassword'),
  ],
  validate,
  updatePassword
);

// GET /api/auth/me - current logged-in user
router.get('/me', authenticate, getMe);

module.exports = router;
