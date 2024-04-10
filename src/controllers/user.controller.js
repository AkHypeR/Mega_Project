import {asynchandler} from '../utils/asynchandeler.js'

import {ApiError} from '../utils/ApiError.js'

import {uploadOnCLoudinary} from '../utils/cloudnairy.js'

import {User} from '../models/user.model.js'

import {ApiResponce} from '../utils/ApiResponce.js'
//get user details from frontend
//validation -check not empty
//check if user already exists: username,email
//check avatar image is there
//upload them cloudnery,avatar
//create user object-create entry in db
//remove aor hide password and refresh token from user 
//check for user creation 
//return respond



const registerUser=asynchandler (async(req,res)=>{
   const {fullName,email,username, password}=req.body
  // console.log("email: " + email);
//    if (fullName==="") {
//     throw new ApiError(400,"fullName is required")
//    }

if(
    [email,fullName,username,password].some((field) => field?.trim()=="")
){
    throw new ApiError(400,"All fields must be specified or Required");
}

const existedUser= await User.findOne({
    $or:[{email},{username}]
})

if (existedUser) {
    throw new ApiError(409,"User already actived in same user name or email");
    
}

    // Algo for getting the files from [0] position i.e. the first position

    // const avatarLocalPath = req.files?.avatar[0]?.path; -- not working //
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; --- not working //
    
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    } // we are writing "files" instead of "file" as we are taking both files i.e. "avatar" & "coverImage"

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

const avatar=await uploadOnCLoudinary(avatarLocalPath)
const coverImage=await uploadOnCLoudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(400,"Avatar not found")
    
}
const user= await User.create({
    fullName,
    avatar: avatar.url,
    username,
    password,
    coverImage: coverImage?.url ||"",
    email,

})

const createUser=await User.findById(user._id).select(
    "-password -refreshToken"
)
if (!createUser) {
    throw new ApiError(500,"something went wrong during registraion user creation")
}

return res.status(200).json(
    new ApiResponce(200,createUser, "user registered successfully")
)

})

export{registerUser}