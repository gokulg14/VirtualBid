const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const Login = require('../../models/Login');

const createUser = async({name,eamil,age,password}) =>{
    const hashedpass = await bcrypt.hash(password,10) 
    await User.create({name,email,age});
    await Login.create({email,password:hashedpass,isActive:false});
    return "User created Successfully"
};

module.exports = {createUser};