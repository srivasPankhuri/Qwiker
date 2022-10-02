const mongoose =require('mongoose')

const{ObjectId}=mongoose.Schema.Types
const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"no photo"
    },
    postType:{
        type:String,
        enum:['text','image','video'],
        default:'text',
        required:true
    },
    username:{
        type:String,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports=mongoose.model('Post',postSchema)
