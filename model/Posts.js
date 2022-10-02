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
    postedBy:{
//         type:ObjectId,
//         ref:"User"
        name:{
            type:String,
            required:false,//to me made compulsory on frontend
        },
        email:{
            type:String,
            required:false,
            max:255
        },
        username:{
            type:String,
            required:false,
            unique:true
        },
        password:{
            type:string,
            required:true,
            max:1024,
            min:6
        },
        date:{
            type:date,
            default:date.now
        },
        imageUrl:{
            type:String,
            required:false
        },
        about:{
            type:String,
            required:false
        }
    }
},{timestamps:true})

module.exports=mongoose.model('Post',postSchema)
