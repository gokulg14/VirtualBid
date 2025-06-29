const express = require('express');
const { getAllBids, getActiveBids, getEndBids, getUpcomingBids, getBidHistory, placeBid, getUserCreatedAuctionsController } = require('../../controllers/bidController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

// Get all bids
router.get('/all-bids', authMiddleware, getAllBids);

// Get active bids
router.get('/active-bids', authMiddleware, getActiveBids);

// Get ended bids
router.get('/end-bids', authMiddleware, getEndBids);

// Get upcoming bids
router.get('/upcoming-bids', authMiddleware, getUpcomingBids);

// Get Bid History for a specific auction
router.get('/bid-history/:bidId', authMiddleware, getBidHistory);

// Get user's created auctions with winner details
router.get('/user-created-auctions/:email', authMiddleware, getUserCreatedAuctionsController);

// Place a bid
router.post('/place-bid', authMiddleware, placeBid);

module.exports = router; 