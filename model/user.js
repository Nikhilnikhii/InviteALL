const mongoose = require('mongoose');

const { Schema }=mongoose;
const mySchema=new Schema({
    typeAuth:{
        type:String,
        required:true
    },
    name:{
        type:String,

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    },


});

module.exports=mongoose.model('User',mySchema);