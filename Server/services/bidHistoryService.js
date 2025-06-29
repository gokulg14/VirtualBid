const BidHistory = require('../models/BidHistory');
const Bid = require('../models/Bid');
const User = require('../models/User');

const getUserBiddingHistory = async (userEmail) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }

        // Get all bid history entries for this user with populated auction details
        const bidHistory = await BidHistory.aggregate([
            {
                $match: { bidder: user._id }
            },
            {
                $lookup: {
                    from: 'bids',
                    localField: 'bidId',
                    foreignField: '_id',
                    as: 'auction'
                }
            },
            {
                $unwind: '$auction'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'bidder',
                    foreignField: '_id',
                    as: 'bidderInfo'
                }
            },
            {
                $unwind: '$bidderInfo'
            },
            {
                $sort: { bidTime: -1 }
            },
            {
                $group: {
                    _id: '$bidId',
                    auction: { $first: '$auction' },
                    userBids: {
                        $push: {
                            bidAmount: '$bidAmount',
                            bidTime: '$bidTime',
                            _id: '$_id'
                        }
                    },
                    highestUserBid: { $max: '$bidAmount' },
                    totalBids: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'auction.highestBidder',
                    foreignField: '_id',
                    as: 'winnerInfo'
                }
            },
            {
                $unwind: {
                    path: '$winnerInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'auction.createdBy',
                    foreignField: '_id',
                    as: 'ownerInfo'
                }
            },
            {
                $unwind: {
                    path: '$ownerInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    auctionId: '$_id',
                    title: '$auction.title',
                    description: '$auction.description',
                    startTime: '$auction.startTime',
                    endTime: '$auction.endTime',
                    startingBid: '$auction.startingBid',
                    highestBid: '$auction.highestBid',
                    status: '$auction.status',
                    imagePath: '$auction.imagePath',
                    highestUserBid: '$highestUserBid',
                    totalBids: '$totalBids',
                    userBids: '$userBids',
                    winnerName: '$winnerInfo.name',
                    ownerName: '$ownerInfo.name',
                    ownerEmail: '$ownerInfo.email',
                    ownerPhone: '$ownerInfo.phone',
                    ownerProfilePicture: '$ownerInfo.profilePicture',
                    isWinner: {
                        $cond: {
                            if: { $eq: ['$auction.highestBidder', user._id] },
                            then: true,
                            else: false
                        }
                    },
                    finalAmount: '$auction.highestBid'
                }
            }
        ]);

        // Transform the data to match the frontend format
        const transformedHistory = bidHistory.map(item => {
            const status = item.isWinner ? 'Winner' : 'Outbid';
            const finalAmount = item.finalAmount || item.startingBid;
            
            return {
                id: item.auctionId,
                houseName: item.title,
                dateStart: new Date(item.startTime).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                }),
                dateEnd: new Date(item.endTime).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                }),
                biddingAmount: item.highestUserBid,
                finalAmount: finalAmount,
                status: status,
                totalBids: item.totalBids,
                image: item.imagePath ? '🏠' : '🏡',
                imagePath: item.imagePath,
                category: 'Auction',
                owner: {
                    name: item.ownerName || 'Unknown',
                    email: item.ownerEmail || '',
                    phone: item.ownerPhone || '',
                    profilePicture: item.ownerProfilePicture || null
                }
            };
        });

        return transformedHistory;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserBiddingHistory
}; 