//using promise

const asynchandler=(requestHandler) =>{
    return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)) .catch(err=>next (err))
    }
}
    




//using asyc and await
/*
const asynchandler=(func)=async(req,res,next)=>{ 
    try {
        await func(req,res,next);
        
    } catch (error) {
        res.status(error.code||500).json({
            success: false,
            message: error.message,});
        console.log(`Error: ${error}`);
        
    }


}
*/



export{asynchandler}