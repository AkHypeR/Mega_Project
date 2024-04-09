import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env. CLOUDINARY_API_KEY, 
  api_secret:  process.env. CLOUDINARY_API_SECRET 
});

const  uploadOnCLoudinary=async(localFilePath)=>{
  try {
    if (!localFilePath) return null
      //upload file in cloudinary
     const responce=await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
      });
      //file has upload been successfully
      console.log("file has upload been successfully on cloudinary", responce.url);
      return responce;
  } catch (error) {
      fs.unlinkSync(localFilePath)//remove the localy saved temporary file as the upload operation got failed
      return null;
  }

}


export {uploadOnCLoudinary}