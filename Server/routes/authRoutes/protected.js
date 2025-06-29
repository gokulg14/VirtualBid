const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { getUserInfo } = require('../../controllers/authController');

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome user ${req.userId}, this is your dashboard.` });
});

router.get('/user-info/:email', authMiddleware, getUserInfo);

module.exports = router;
