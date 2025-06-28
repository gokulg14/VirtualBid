const mongoose = require('mongoose');
const autoInc = require('mongoose-sequence')(mongoose);
const schema = mongoose.Schema;

const bidSchema = new schema({
  bidId: { type: Number, unique: true },
  title: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  startingBid: { type: Number, required: true },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  imagePath: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  }
}, { timestamps: true });


bidSchema.plugin(autoInc, { inc_field: 'bidId' });
module.exports = mongoose.model('Bid', bidSchema);
