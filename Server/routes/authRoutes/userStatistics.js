const express = require('express');
const router = express.Router();
const { getUserStatistics } = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/user-statistics/:email', authMiddleware, getUserStatistics);

module.exports = router; 