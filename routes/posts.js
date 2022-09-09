const router = require('express').Router();
const verify=require('../verifyToken');
const mongoose =require('mongoose')
const Post=require('../model/Posts');

//add these 2 lines to make sure the parsing functionality is passed on to access body
router.use(require('express').json());
router.use(require('express').urlencoded({ extended: true }));


router.get("/",(req,res)=>{
    res.send("post route");
})

router.post('/createpost',verify,(req,res)=>{
    const{title,body}=req.body
    if(!title||!body){
        res.status(422).json({error:"Add fields"})
    }
    // console.log(req.user)
    // res.send("ok")
    const post=new Post({
        title,
        body,
        postedBy:req.user.id
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router;
