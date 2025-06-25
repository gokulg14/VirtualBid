const { createUser } = require('../services/authService');
const { login } = require('../services/authService');
const { logout } = require('../services/authService');

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

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
