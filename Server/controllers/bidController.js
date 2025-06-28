const { createBid } = require('../services/bidService');
const Bid = require('../models/Bid');
const User = require('../models/User');
const BidHistory = require('../models/BidHistory');

const addBid = async (req, res) => {
  try {
    const {
      title, description, startTime, endTime,
      startingBid, status: providedStatus
    } = req.body;

    // Validate image if provided
    let imagePath = 'uploads/default-property.jpg'; // Default image path
    if (req.file) {
      const { mimetype, size } = req.file;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(mimetype)) {
        return res.status(400).json({ error: "Only JPG/PNG images are allowed" });
      }
      if (size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "Image must be under 10MB" });
      }
      imagePath = req.file.path;
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }

    // Determine status
    const now = new Date();
    let status = providedStatus || 'upcoming';
    if (now >= start && now <= end) status = 'active';
    else if (now > end) status = 'ended';

    const bid = await createBid({
      title, 
      description, 
      startTime: start, 
      endTime: end,
      startingBid: parseFloat(startingBid), 
      highestBid: parseFloat(startingBid),
      imagePath: imagePath, 
      createdBy: req.userId, 
      status
    });

    res.status(201).json({ message: "Bid created successfully", bid });
  } catch (err) {
    console.error('Error creating bid:', err);
    res.status(500).json({ error: err.message });
  }
};

const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find({ status: { $in: ['active', 'upcoming'] } })
      .populate('createdBy', 'name email')
      .populate('highestBidder', 'name email')
      .sort({ startTime: 1 });

    // Get bid counts for each bid
    const bidsWithCount = await Promise.all(bids.map(async (bid) => {
      const bidCount = await BidHistory.countDocuments({ bidId: bid._id });
      const bidObj = bid.toObject();
      bidObj.totalBids = bidCount;
      return bidObj;
    }));

    res.status(200).json(bidsWithCount);
  } catch (error) {
    console.error('Error fetching all bids:', error);
    res.status(500).json({ error: error.message });
  }
};

const getActiveBids = async (req, res) => {
  try {
    const activeBids = await Bid.find({ status: 'active' })
      .populate('createdBy', 'name email')
      .populate('highestBidder', 'name email')
      .sort({ startTime: 1 });
    res.status(200).json(activeBids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEndBids = async (req, res) => {
  try {
    const endBids = await Bid.find({ status: 'ended' })
      .populate('createdBy', 'name email')
      .populate('highestBidder', 'name email')
      .sort({ startTime: 1 });
    res.status(200).json(endBids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const placeBid = async (req, res) => {
  try {
    const { bidId, bidAmount } = req.body;
    
    if (!bidId || !bidAmount) {
      return res.status(400).json({ error: "Bid ID and bid amount are required" });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    // Check if bid is still active
    if (bid.status !== 'active') {
      return res.status(400).json({ error: "Bid is not active" });
    }

    // Check if bid amount is higher than current highest bid
    if (parseFloat(bidAmount) <= bid.highestBid) {
      return res.status(400).json({ error: "Bid amount must be higher than current highest bid" });
    }

    // Record the bid in history
    await BidHistory.create({
      bidId: bidId,
      bidder: req.userId,
      bidAmount: parseFloat(bidAmount)
    });

    // Update the bid
    bid.highestBid = parseFloat(bidAmount);
    bid.highestBidder = req.userId;
    await bid.save();

    // Populate user information
    await bid.populate('highestBidder', 'name email');

    res.status(200).json({ 
      message: "Bid placed successfully", 
      bid: bid.toObject()
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addBid, getAllBids, getActiveBids, getEndBids, placeBid };
