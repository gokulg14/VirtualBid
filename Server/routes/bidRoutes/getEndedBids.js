const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getEndBids } = require('../../controllers/bidController');

// Get Active Bids
router.get('/end-bids', authMiddleware, getEndBids);

module.exports = router;
