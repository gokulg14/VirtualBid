const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getActiveBids } = require('../../controllers/bidController');

// Get Active Bids
router.get('/active-bids', authMiddleware, getActiveBids);

module.exports = router;
