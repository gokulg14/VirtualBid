const mongoose = require('mongoose');
const autoInc = require('mongoose-sequence')(mongoose);
const schema = mongoose.Schema;

const bidHistorySchema = new schema({
  bidHistoryId: { type: Number, unique: true },
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now }
}, { timestamps: true });

bidHistorySchema.plugin(autoInc, { inc_field: 'bidHistoryId' });
module.exports = mongoose.model('BidHistory', bidHistorySchema); 