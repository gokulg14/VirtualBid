const jwt = require('jsonwebtoken');
const Login = require('../models/Login');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get the login record to find the associated user
            const loginRecord = await Login.findOne({ loginId: decoded.id });
            if (!loginRecord) {
                return res.status(401).json({ error: "Invalid token" });
            }

            // Get the user record
            const user = await User.findOne({ email: loginRecord.email });
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }

            req.userId = user._id; // Set the MongoDB ObjectId of the user
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        return res.status(401).json({ error: "Authorization header missing" });
    }
};

module.exports = authMiddleware;
