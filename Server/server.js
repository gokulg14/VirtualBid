const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const regRoute = require('./routes/authRoutes/register');
const loginRoute = require('./routes/authRoutes/login');
const logoutRoute = require('./routes/authRoutes/logout');
const protectedRoute = require('./routes/authRoutes/protected');
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
app.use('/bid', addBid);
app.use('/bid', activeBids);
app.use('/bid', endBids);
app.use('/bid', getAllBids);
app.use('/bid', placeBid);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(e => console.error(e));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
