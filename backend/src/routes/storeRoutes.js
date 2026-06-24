const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const validate = require('../middleware/validate');

const { listStoresForUser } = require('../controllers/storeController');
const { submitRating } = require('../controllers/ratingController');
const { ratingValidator } = require('../utils/validators');

// Every route below requires a logged-in Normal User
router.use(authenticate, authorize('user'));

// GET /api/stores?name=&address=&sortBy=&order=
router.get('/', listStoresForUser);

// POST /api/stores/:storeId/rating - create or update the caller's rating
router.post('/:storeId/rating', [ratingValidator()], validate, submitRating);

module.exports = router;
