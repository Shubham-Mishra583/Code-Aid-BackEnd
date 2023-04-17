const express = require("express");
const app = express();
const connectDB = require('./config/db');
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const  cors = require('cors');
app.use(cors({origin : "https://code-aid.netlify.app"}))
// connectDB();
app.use(express.json({extended : false}));

app.get("/",(req,res)=>{
    res.send("Hello");
})

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// app.listen(PORT,()=>{
//     console.log(`Server started at port ${PORT}`);
// })

const startServer = async() =>{
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server started at port ${PORT}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

startServer();
