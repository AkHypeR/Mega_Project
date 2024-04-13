import {asynchandler} from '../utils/asynchandeler.js'

import {ApiError} from '../utils/ApiError.js'

import {uploadOnCLoudinary} from '../utils/cloudnairy.js'

import {User} from '../models/user.model.js'

import {ApiResponce} from '../utils/ApiResponce.js'

import jsonwebtoken from "jsonwebtoken";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken ()
        const refreshToken = user.generateRefreshToken ()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken , refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser=asynchandler (async(req,res)=>{
   const {fullName,email,username, password}=req.body
  // console.log("email: " + email);
//    if (fullName==="") {
//     throw new ApiError(400,"fullName is required")
//    }




//get user details from frontend
//validation -check not empty
//check if user already exists: username,email
//check avatar image is there
//upload them cloudnery,avatar
//create user object-create entry in db
//remove aor hide password and refresh token from user 
//check for user creation 
//return respond


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




//login the user 
const loginUser=asynchandler(async (req,res) => {
    
      // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponce(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


const logOut=asynchandler(async (req, res) => {

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true,
        }
    )
    const options ={
        httpOnly: true,
        secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken",options)
    .cookie("refreshToken",options)
    .json(
        new ApiResponce(
            200, 
            {},
            "User logged out  successfully"
        )
    )


})

const refreshAccessToken=asynchandler(async (req, res) => {


   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
   if(!incomingRefreshToken){
    throw new ApiError(404,"Refresh token not available")
   }
   try {
   const decodedToken = jsonwebtoken.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   const user= await User.findById(decodedToken?._id)
   if (!user) {
    throw new ApiError(401,"Invalid refresh token")
   }
    if (incomingRefreshToken !==user?.refreshToken) {
     throw new ApiError(401,"Refresh token is expired or used") 
   }

   const options={
    httpOnly: true,
    secure: true,
   }

  const {newaccessToken,newrefreshToken}= await generateAccessAndRefereshTokens(user._id)

  return res
  .status(200)
  .cookie("accessToken",newaccessToken,options)
  .cookie("rrefreshToken",newrefreshToken,options)
  .json(
    new ApiResponce(
        200,
        {accessToken:newaccessToken,
         refreshToken:   newrefreshToken},
            "Access Token created successfully"
    )
  )


    //accessToken
} catch (error) {
    throw new ApiError(401,error?.message||"Invalid refresh token")
    
}



})



export{registerUser,loginUser,logOut,refreshAccessToken}