const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { placeBid } = require('../../controllers/bidController');

// Place a bid on an auction item
router.post('/place-bid', authMiddleware, placeBid);

module.exports = router; 