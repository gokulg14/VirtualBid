const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const BidHistory = require('../models/BidHistory');
const User = require('../models/User');

const getUserStatistics = async (userEmail) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }

        // Get all bids placed by this user (from bid history)
        const userBids = await BidHistory.find({ bidder: user._id });
        
        // Get unique auctions the user has participated in
        const uniqueAuctions = [...new Set(userBids.map(bid => bid.bidId.toString()))];
        
        // Get total bids count
        const totalBids = userBids.length;
        
        // Get active bids (bids on active auctions)
        const activeBids = await BidHistory.aggregate([
            {
                $match: { bidder: user._id }
            },
            {
                $lookup: {
                    from: 'bids',
                    localField: 'bidId',
                    foreignField: '_id',
                    as: 'bidInfo'
                }
            },
            {
                $unwind: '$bidInfo'
            },
            {
                $match: { 'bidInfo.status': 'active' }
            },
            {
                $group: {
                    _id: '$bidId',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const activeBidsCount = activeBids.length;
        
        // Get won auctions (auctions where user is the highest bidder and auction has ended)
        const wonAuctions = await Bid.aggregate([
            {
                $match: {
                    highestBidder: user._id,
                    status: 'ended'
                }
            }
        ]);
        
        const wonAuctionsCount = wonAuctions.length;
        
        // Calculate success rate
        const participatedAuctions = await Bid.aggregate([
            {
                $match: {
                    _id: { $in: uniqueAuctions.map(id => new mongoose.Types.ObjectId(id)) },
                    status: 'ended'
                }
            }
        ]);
        
        const endedAuctionsCount = participatedAuctions.length;
        const successRate = endedAuctionsCount > 0 ? Math.round((wonAuctionsCount / endedAuctionsCount) * 100) : 0;
        
        return {
            totalBids,
            wonAuctions: wonAuctionsCount,
            successRate: `${successRate}%`,
            activeBids: activeBidsCount
        };
        
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserStatistics
}; 