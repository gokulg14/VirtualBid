const mongoose = require('mongoose');

const autoInc = require('mongoose-sequence')(mongoose);



const schema = mongoose.Schema;

const userSchema = new schema({
    userId:{
        type:Number,
        unique:true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        required:true
    }
},{timestamps:true})

userSchema.plugin(autoInc,{inc_field: 'userId'});

module.exports = mongoose.model('User',userSchema)