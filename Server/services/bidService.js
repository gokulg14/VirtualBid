const Bid = require('../models/Bid');
const User = require('../models/User');

const createBid = async (bidData) => {
    try {
        const bid = new Bid(bidData);
        await bid.save();
        return bid;
    } catch (error) {
        throw error;
    }
};

const getUserCreatedAuctions = async (userEmail) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }

        // Get all auctions created by this user with winner details
        const auctions = await Bid.aggregate([
            {
                $match: { createdBy: user._id }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'highestBidder',
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
                    from: 'bidhistories',
                    localField: '_id',
                    foreignField: 'bidId',
                    as: 'bidHistory'
                }
            },
            {
                $addFields: {
                    totalBids: { $size: '$bidHistory' }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    startTime: 1,
                    endTime: 1,
                    startingBid: 1,
                    highestBid: 1,
                    status: 1,
                    imagePath: 1,
                    totalBids: 1,
                    winner: {
                        name: '$winnerInfo.name',
                        email: '$winnerInfo.email',
                        phone: '$winnerInfo.phone',
                        profilePicture: '$winnerInfo.profilePicture'
                    },
                    hasWinner: { $ne: ['$highestBidder', null] }
                }
            }
        ]);

        return auctions;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBid,
    getUserCreatedAuctions
};
