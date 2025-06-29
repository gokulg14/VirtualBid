const { createUser } = require('../services/authService');
const { login } = require('../services/authService');
const { logout } = require('../services/authService');
const { getUserStatistics } = require('../services/statisticsService');
const { getUserBiddingHistory } = require('../services/bidHistoryService');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const result = await login(req.body);  // Pass email & password
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logoutUser = async (req, res) => {
    const { email } = req.body;

    try {
        const message = await logout(email);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { email, name, phone } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;

        // Handle profile picture upload
        if (req.file) {
            // Remove old profile picture if exists
            if (user.profilePicture && user.profilePicture !== 'uploads/default-profile.jpg') {
                const fs = require('fs');
                const path = require('path');
                const oldImagePath = path.join(__dirname, '..', user.profilePicture);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            user.profilePicture = req.file.path;
        }

        await user.save();
        
        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: {
                name: user.name,
                email: user.email,
                age: user.age,
                phone: user.phone,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserStatisticsController = async (req, res) => {
    try {
        const email = req.params.email;
        
        const statistics = await getUserStatistics(email);
        
        res.status(200).json({ statistics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBiddingHistoryController = async (req, res) => {
    try {
        const email = req.params.email;
        
        const biddingHistory = await getUserBiddingHistory(email);
        
        res.status(200).json({ biddingHistory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo,
    updateUserProfile,
    getUserStatistics: getUserStatisticsController,
    getUserBiddingHistory: getUserBiddingHistoryController
};
