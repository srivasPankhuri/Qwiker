const router = require('express').Router();
const User=require('../model/User');
const verify=require('../verifyToken');
const path=require("path");
// multer
const multer  = require('multer')
// disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/",verify,async(req,res)=>{
res.send("this is user route");
});


router.get("/myprofile",verify,async (req,res)=>{
    // show user data
    try{
        id=await req.user._id; // getting id form the jwt encryption
        
       const user=await User.findById(id);
       if(!user){
           res.status(200).json({ success: false, message: "user not found" });
       }else{
           
          
           const {password,testResult,...others}=user._doc;
           res.status(200).json({...others});
       }
        }catch (e){
            
            res.status(500).json({ success: false, message: "server data not found" });
        }
});
// update user profile (test)
router.patch("/myprofile",verify,upload.single('imageUrl'), async(req,res)=>{
    // update user profile here
    // const salt=await bcrypt.genSalt(10);
    // const hashedPass=await bcrypt.hash(req.body.password,salt);
    id= req.user._id;
   
   
    User.findByIdAndUpdate(id,{
        name:req.body.name,
        username:req.body.username,
        imageUrl:req.file.path,
        about:req.body.about      
        
    }).then((user)=>{
        // console.log(user.additionalDetails['hello']);
        res.status(200).json({ success: true, message: "user profile updated Success" });
    }).catch((error)=>{
        console.log(error);
        res.status(500).json({ success: false, message: "user profile not updated" });

    });


});
// router.get("")

module.exports=router;