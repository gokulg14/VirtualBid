const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome user ${req.userId}, this is your dashboard.` });
});

module.exports = router;
