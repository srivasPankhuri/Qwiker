const router = require('express').Router();
const User=require('../model/User');
const jwt= require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {registerValidation,loginValidation}=require('../validation');

//add these 2 lines to make sure the parsing functionality is passed on to access body
router.use(require('express').json());
router.use(require('express').urlencoded({ extended: true }));



// Register
router.post('/register',async(req,res)=>{

    //Validate the data before creating the user
    const{error} =registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    
    //If the user is already in the database
    const emailExist= await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password,salt);

    //Create a new user
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    try{
        const savedUser=await user.save();
        res.send({user:user._id});
    }catch(err){

        // res.status(400).send(err);
    }
});


//Login
router.post('/login',async(req,res)=>{
     //Validate the data before 
     const{error} =loginValidation(req.body);
     if(error) return res.status(400).send(error.details[0].message); 

     //If the email exists
    const user= await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email or password wrong');

    //If password is correct
    const validPass= await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password');


    //Create and assign a token
    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.json({token});

    // res.send('Logged In');
})


module.exports=router;
