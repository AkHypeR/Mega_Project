
// require('dotenv').config({path:'./enc'})
import { app } from './app.js';
import dotenv from 'dotenv'
import connectDB from './db/db.js'
dotenv.config({path:'./env'});

connectDB ()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONO DB CONNECTION FAILED !!!",err);
})



