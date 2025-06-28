const Bid = require('../models/Bid');

const createBid = async (data) => {
  const bid = await Bid.create(data);
  return bid;
};

module.exports = { createBid };
