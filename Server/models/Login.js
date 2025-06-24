const mongoose = require('mongoose');

const autoInc = require('mongoose-sequence')(mongoose);



const schema = mongoose.Schema;

const loginSchema = new schema({
    loginId:{
        type:Number,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    isActive:{
        type:Boolean
    }
},{timestamps:true})

loginSchema.plugin(autoInc,{inc_field: 'loginId'});

module.exports = mongoose.model('Login',loginSchema)