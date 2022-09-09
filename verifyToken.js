const jwt = require('jsonwebtoken');

module.exports=function (req,res,next){
    const authHeader= req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    
    if(authHeader){
        
       
       token= req.headers.authorization.split(" ")[1]
        // console.log(token);
        jwt.verify(token,process.env.TOKEN_SECRET,(error,user)=>{
            if(error){
                res.status(400).json({ success: false, message: "Token is not valid" });
                
            }else{
                req.user=user;
                next();
            }
        });
    }else{
        return res.status(400).json({ success: false, message: "you are not authenticated" });
    }
}



