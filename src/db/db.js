import mongoose from "mongoose";
import express from "express";

import { DB_NAME } from "../constants.js";


const coonectDB=async ()=>{
    try {
        const dbconnection = await mongoose.connect(`${process.env. DATABASSE_URI}/${DB_NAME}`);

        console.log(`MONGODB CONNECTED AT    :${dbconnection.connection.host}`);
    } catch (error) {
        console.log(`connection failed in db connection ${error}`);
        process.exit(1);
        
    }
}

export default coonectDB;