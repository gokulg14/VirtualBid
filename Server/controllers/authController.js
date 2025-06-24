const { createUser } = require('../services/authService');

const registerUser = async (req, res) => {
    try {
        const result = await createUser(req.body); // passes name, email, age, password
        res.status(200).json(result); // success message or user info
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    registerUser
};
