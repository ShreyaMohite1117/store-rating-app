const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const validate = require('../middleware/validate');

const { getDashboardStats, createUser, listUsers, getUserDetail } = require('../controllers/adminController');
const { createStore, listStoresAdmin } = require('../controllers/storeController');
const {
  nameValidator,
  emailValidator,
  addressValidator,
  passwordValidator,
  roleValidator,
} = require('../utils/validators');

// Every route below requires a logged-in Admin
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users (admin / user / owner)
router.post(
  '/users',
  [nameValidator(), emailValidator(), addressValidator(), passwordValidator(), roleValidator()],
  validate,
  createUser
);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);

// Stores
router.post('/stores', [nameValidator(), emailValidator(), addressValidator()], validate, createStore);
router.get('/stores', listStoresAdmin);

module.exports = router;
