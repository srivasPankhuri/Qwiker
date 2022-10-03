const router=require("express").Router();

// import routes
const userRoute=require("./user");
const authRoute=require("./auth.js");
const postRoute=require("./posts.js");


router.get("/",(req,res)=>{
    res.send("this is social media api");
})

router.use("/user",userRoute);
router.use("/auth",authRoute);
router.use("/posts",postRoute);















module.exports=router;
