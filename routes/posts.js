const router = require('express').Router();
const verify=require('../verifyToken');
const mongoose =require('mongoose')
const Post=require('../model/Posts');
// multer
const multer  = require('multer')
// disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/postsImages/')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

//add these 2 lines to make sure the parsing functionality is passed on to access body
router.use(require('express').json());
router.use(require('express').urlencoded({ extended: true }));


router.get("/",(req,res)=>{
    res.send("post route");
})

// show all the posts (entire feeds);
router.get("/showAllPosts",verify,async(req,res)=>{
    
    try{
        id=await req.user._id; // getting id form the jwt encryption
        
       const post=await Post.find({}).populate({path:"postedBy", model:"User", select:"name email username date imageUrl about"});
       if(!post){
           res.status(200).json({ success: false, message: "post not found" });
       }else{
           
          
           
           res.status(200).json(post);
       }
        }catch (e){
            
            res.status(500).json({ success: false, message: "server data not found" });
        }

})

// create post by user
router.post('/createpost',verify,upload.single('photo'),(req,res)=>{
    // const{title,body}=req.body
    
    // if(!title||!body){
    //     res.status(422).json({error:"Add fields"})
    // }
    // console.log(req.user)
    // res.send("ok")
    const post=new Post({
        title:req.body.title,
        body:req.body.body,
        photo:req.file.path,
        postedBy:req.user._id
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})
// show the posts posted by the user
router.get("/showMyPosts",verify,async(req,res)=>{
    try{
        id=await req.user._id; // getting id form the jwt encryption
        
       const userPost=await Post.find({postedBy:id});
       if(!userPost){
           res.status(200).json({ success: false, message: "User post not found" });
       }else{
           
          
           
           res.status(200).json(userPost);
       }
        }catch (e){
            
            res.status(500).json({ success: false, message: "server data not found" });
        }
})


module.exports=router;
