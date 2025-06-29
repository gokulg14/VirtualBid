const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const regRoute = require('./routes/authRoutes/register');
const loginRoute = require('./routes/authRoutes/login');
const logoutRoute = require('./routes/authRoutes/logout');
const protectedRoute = require('./routes/authRoutes/protected');
const updateProfileRoute = require('./routes/authRoutes/updateProfile');
const userStatisticsRoute = require('./routes/authRoutes/userStatistics');
const userBiddingHistoryRoute = require('./routes/authRoutes/userBiddingHistory');
const addBid = require('./routes/bidRoutes/addBid');
const activeBids = require('./routes/bidRoutes/getActiveBids');
const endBids = require('./routes/bidRoutes/getEndedBids');
const getAllBids = require('./routes/bidRoutes/getAllBids');
const placeBid = require('./routes/bidRoutes/placeBid');
require('./cron/updateBidStatus');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/auth', regRoute);
app.use('/auth', loginRoute);
app.use('/auth', protectedRoute);
app.use('/auth', logoutRoute);
app.use('/auth', updateProfileRoute);
app.use('/auth', userStatisticsRoute);
app.use('/auth', userBiddingHistoryRoute);
app.use('/bid', addBid);
app.use('/bid', activeBids);
app.use('/bid', endBids);
app.use('/bid', getAllBids);
app.use('/bid', placeBid);

// Set default values for environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/virtualbid';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Set JWT_SECRET globally if not already set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = JWT_SECRET;
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(e => console.error('MongoDB connection error:', e));

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
