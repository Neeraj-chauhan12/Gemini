const Bcrypt=require('bcrypt')
const User=require('../models/UserModel')
const jwt=require('jsonwebtoken')




exports.Register=async(req,res)=>{

    const {name,email,password}=req.body;
    try {

        if(!name || !email || !password){
            return res.status(400).json({message:"all field are required"})
        }

        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"user already axists please login not signup go login page "});
        }

      const hashPassword=await Bcrypt.hash(password,10);
      const user= await User.create({
        name,
        email,
        password:hashPassword
      })

      res.status(201).json({message:"user created succusssfully",user})

    } catch (error) {
        console.log("error in registration server",error)
        return res.status(500).json({message:"error in registration server"})
        
    }


}


exports.Login=async(req,res)=>{ 
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const isMatch=await Bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }
      
        // generate token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.cookie("token",token,{httpOnly:true})
        res.json({message:"login succusssfully",user,token})


    } catch (error) {
        console.log("error in registration server",error)
        return res.status(500).json({message:"error in registration server"})
        
        
    }
}

exports.logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(201).json({message:"logout succefully"})
        
    } catch (error) {
        console.log("error in logout server",error)
        return res.status(500).json({message:"error in logout server"})
        
    }
}

exports.getProfile=async(req,res)=>{
    const userId=req.user.id;
    try {
        const user=await User.findById(userId).select("-password")
        res.status(201).json({message:"user profile",user})
        
    } catch (error) {
         console.log("error in logout server",error)
        return res.status(500).json({message:"error in profile server",error})
        
        
    }
}


// exports.updateProfile=async(req,res)=>{
//     const userId=req.user.id;
//     const {username}=req.body;
//     const profilePhoto=req.file
//     try {

//         const user=await User.findById(userId);

//         if(!user){
//             return res.status(404).json({message:"user not found"})
//         }

//         let updateData = { username };

//         // If a new profile photo was uploaded, delete old one and upload the new
//         if (profilePhoto) {
//             if (user.photoURL) {
//                 const publicId = user.photoURL.split("/").pop().split(".")[0];
//                 try {
//                     await deleteMediaFromCloudinary(publicId);
//                 } catch (err) {
//                     console.warn('failed to delete previous image from cloudinary', err);
//                 }
//             }

//             const cloudResponse = await uploadMedia(profilePhoto.path);
//             const photoURL = cloudResponse.secure_url;
//             updateData.photoURL = photoURL;
//         }

//         const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

//         return res.status(200).json({ message: "profile updated successfully", user: updatedUser });

        
//     } catch (error) {

//           console.log("error in profile update server",error)
//         return res.status(500).json({message:"error in profile server",error})
        
        
//     }
// }