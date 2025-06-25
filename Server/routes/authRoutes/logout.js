// routes/authRoutes/logout.js
const express = require('express');

const { logoutUser } = require('../../controllers/authController')

const router = express.Router();

router.post('/user-logout', logoutUser);

module.exports = router;
