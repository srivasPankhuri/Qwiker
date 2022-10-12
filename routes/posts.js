const router = require('express').Router();
const verify=require('../verifyToken');
const mongoose =require('mongoose')
const Post=require('../model/Posts');
const User = require('../model/User');
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
router.post('/createpost',verify,upload.single('photo'),async(req,res)=>{
    // const{title,body}=req.body
    
    // if(!title||!body){
    //     res.status(422).json({error:"Add fields"})
    // }
    // console.log(req.user)
    // res.send("ok")
    
    const user= await User.findById(req.user._id);
    
    var username;
    if(user.username){ // if no username at the sign in account
        username=user.username
    }else{
        username=" ";
    }
    
    const post=new Post({
        title:req.body.title,
        body:req.body.body,
        photo:req.file.path,
        postedBy:req.user._id,
        username:req.body.username,
        postType:req.body.postType
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
        
       const userPost=await Post.find({}).populate({path:"postedBy", model:"User", select:"name email username date imageUrl about"});;
       if(!userPost){
           res.status(200).json({ success: false, message: "User post not found" });
       }else{
           
          
           
           res.status(200).json(userPost);
       }
        }catch (e){
            
            res.status(500).json({ success: false, message: "server data not found" });
        }
})

// Like a post
router.put('/like',verify,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("comments.writer","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//Unlike a post
router.put('/unlike',verify,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).populate("comments.writer","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//Comment on a post
router.put('/comment',verify,(req,res)=>{
    const comment = {
        text:req.body.text,
        content: req.body.content,
        writer: req.user._id,
        postId: req.body.postId,
        responseTo: req.body.responseTo
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.writer","_id username imageUrl")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            console.log(result);
            res.json(result)
        }
    })
})

//Delete a post
router.delete('/deletepost/:postId',verify,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

//Delete a comment
router.delete('/comment',verify,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:req.body.commentId}}
    },{
        new:true
    })
    .populate("comments.writer","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
           // console.log(result);
            res.json(result)
        }
    })
})



module.exports=router;
