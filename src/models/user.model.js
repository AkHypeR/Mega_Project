import mongoose from "mongoose";
import bcrypt from "bcrypt"

import jsonwebtoken from "jsonwebtoken";
const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required: true,
        trim:true,
        index:true,
    },
    avater:{
        type:String, //cloudinary url
        required: true,
    },
    coverImage:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required:[true,'Password is requird'], 
    },
    refreshToken:{
        type:String,
    }

        
    

},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare("password",this.password)
}



userSchema.methods.generateRefreshToken=function(){
    return jsonwebtoken.sign({
       _id:this._id,
       email:this.email,
       username:this.username,
       fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:this. ACCESS_TOKEN_EXPIRY
    }
)
}




userSchema.methods.generateRefreshToken=function(){
    return jsonwebtoken.sign({
       _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:this. REFRESH_TOKEN_SECRET_EXPIRY
    }
)
}

export const User=mongoose.model('User',userSchema)