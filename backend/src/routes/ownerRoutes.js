const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const { getOwnerDashboard } = require('../controllers/ownerController');

// Every route below requires a logged-in Store Owner
router.use(authenticate, authorize('owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
