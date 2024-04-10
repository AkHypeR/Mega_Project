import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new mongoose.Schema({
    usename:{
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
    fullNmae:{
        type:String,
        required: true,
        trim:true,
        index:true,
    },
    avatar:{
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


videoSchema.plugin(mongooseAggregatePaginate)


export const Video=mongoose.model('Video',videoSchema)