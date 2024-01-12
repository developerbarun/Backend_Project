import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js" 
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler(async (req,res) => {
    //get user data from front end 
    //user vadidation - not empty
    //check if user already exist (username , email)
    //is avtar and img are availablem 
    //upload them to cloudinary , avtar  
    //create user object - create entry in db
    //remove password and refresh token field from response 
    //check for user creation
    //return response
    const {fullName,email,password} = req.body;
    console.log(req.body);    
    if(
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All field are required")
    }

    const existingUser = User.findOne({
        $or : [{username},{email}]
    })
    if(existingUser){
        throw ApiError(409,"User with email or username already exist");
    }

    const  avtarLocalPath = req.files?.avtar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avtarLocalPath){
        throw ApiError(400,"Avtar file is required");
    }

    const avtar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avtar){
        throw ApiError(400,"Avtar file is required");
    }

    const user = await User.create({
        fullName,
        avtar : avtar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username :username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw ApiError(500,"Something went wrong while registering user")
    }
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

export {registerUser}