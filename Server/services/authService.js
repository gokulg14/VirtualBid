const bcrypt = require('bcryptjs');

const User = require('../models/User');

const Login = require('../models/Login');

const generateToken = require('../utils/generateToken');

const createUser = async({name,email,age,password}) =>{

    const existingUser = await Login.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedpass = await bcrypt.hash(password,10);

    await User.create({name,email,age});
    await Login.create({email,password:hashedpass,isActive:false});

    return "User created Successfully"
};

const login = async ({ email, password }) => {
    const user = await Login.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Invalid credentials");
    }

    user.isActive = true;
    await user.save();

    // Generate JWT token
    const token = generateToken(user.loginId);

    return { message: "Login successful", token };
};

const logout = async (email) => {
    const user = await Login.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    user.isActive = false;
    await user.save();
    return "Logout successful";
};

module.exports = {createUser,login,logout};