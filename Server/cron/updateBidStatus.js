const cron = require('node-cron');
const Bid = require('../models/Bid');

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  await Bid.updateMany(
    { endTime: { $lt: now } },
    { $set: { status: 'ended' } }
  );
  await Bid.updateMany(
    { startTime: { $lte: now }, endTime: { $gte: now } },
    { $set: { status: 'active' } }
  );
  await Bid.updateMany(
    { startTime: { $gt: now } },
    { $set: { status: 'upcoming' } }
  );
  console.log('↻ Bid statuses updated at', now.toISOString());
});
