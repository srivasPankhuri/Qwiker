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
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        writer:{
            type:ObjectId,
            ref:'User'
        },
        postId:{
            type:ObjectId,
            ref:'Post'
        },
        responseTo:{
            type:ObjectId,
            ref:'User'
        },
        content:{
            type:String
        }
    }],
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
