const express = require('express');
const router = express.Router();
const { getAllBids } = require('../../controllers/bidController');

// Get All Bids (for public viewing)
router.get('/all-bids', getAllBids);

module.exports = router; 