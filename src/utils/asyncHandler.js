const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
} 

export {asyncHandler};


//Making a Wrapper using Try catch

// const asyncHandler = (fn) => async (req,res,next) => {
//     try{
//         await (req,res,next)
//     }catch(err){
//         resizeBy.status(err.code || 500).json(
//             {
//                 success : false,
//                 message : err.message
//             }
//         ) 
//     }
// }