const express= require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose= require('mongoose');
//Import Routes
const authRoute=require('./routes/auth');

const postRoute= require('./routes/posts');

dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT,
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





// Route Middlewares
app.get('/',(req,res)=>{
    res.send('hello');
})
app.use('/api/user',authRoute);
app.use('/api/posts', postRoute);

app.listen(3000,()=> console.log("Server is up and running"));