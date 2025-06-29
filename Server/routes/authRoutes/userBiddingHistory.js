const express = require('express');
const router = express.Router();
const { getUserBiddingHistory } = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/user-bidding-history/:email', authMiddleware, getUserBiddingHistory);

module.exports = router; 