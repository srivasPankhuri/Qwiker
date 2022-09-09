const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:false,// to be made compulsory on frontend
    },
    email:{
        type:String,
        required:true,
        max:255
    },
    username:{
        type:String,
        required:false,
        unique:true
    },
    password:{
        type:String,
        required:true,
        max:1024,
        min:6
    },
    date:{
        type:Date,
        default:Date.now
    },
    imageUrl:{
        type:String,
        required:false
    },
    about:{
        type:String,
        required:false
    }
})

module.exports=mongoose.model('User',userSchema);