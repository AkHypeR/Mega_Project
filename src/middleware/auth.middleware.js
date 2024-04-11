import jsonwebtoken from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandeler.js";
import { User } from "../models/user.model.js";

export const  verifyJWT=asynchandler(async(req,res,next)=>{
  try {
     const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
     if (!token) {
          throw new ApiError(404,"Unauthorized request") 
     }
  
     const decodedTOken=jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
     const user=await User.findById(decodedTOken?._id).select("-password -refreshToken")
  
     if (!user) {
      throw new ApiError(401,"Invalid access token")
     }
  
  req.user=user;
  next();
  } catch (error) {
    throw new ApiError(401,"Invalid access token") 
}
  }
)