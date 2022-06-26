const express= require('express');
const port=process.env.PORT||80;
const app=express();
const dotenv=require('dotenv');
const mongoose= require('mongoose');
const cors=require('cors');
dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_connect,
    {
        useNewUrlParser: true
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    },
    ()=>{   
        console.log("Connected to Database");
    });
    
    
    
    
    
    
    //Middleware
    app.use(express.json());
    app.use(cors());
    
    
    
    
//Import Routes
const authRoute=require('./routes/auth');

const postRoute= require('./routes/posts');
// Route Middlewares
app.get('/',(req,res)=>{
    res.send('hello');
})
app.use('/api/user',authRoute);
app.use('/api/posts', postRoute);

app.listen(port,()=> console.log("Server is up and running"));