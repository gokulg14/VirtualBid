const express = require('express');

const mongoose = require('mongoose');


const router = express.Router()

router.post('/user-reg',async(req,res)=>{

    const {name,email,age,password} = req.body
    
    
})

module.exports=router