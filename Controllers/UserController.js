import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

//get user
export const getUser = async(req,res)=>{
    const id = req.params.id;
    
    try {
        const user = await UserModel.findById(id);
        if(user){
            const {password,...otherDetails}=user._doc
            res.status(200).json(otherDetails);
        }else{
            res.status(400).json({message:"User not found"});
        }
    } catch (error) {
        res.status(500).json({message:"Invalid Credintals"});
    }
}

//update user

export const updateUseer = async(req,res)=>{
    const id = req.params.id
    const {currentUserId,currentUserAdminStatus,password}=req.body
    if(id===currentUserId || currentUserAdminStatus){
        try {

            if(password){
                const salt =await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password,salt)
            }
            const user = await UserModel.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).json({message:"Updated Succesfully" ,user})
        } catch (error) {
            res.status(500).json({message:"somthing went wrong"})
        }
    }else{
        res.status(400).json({message:"You can only update your profile"})
    }
}

//deletUser

export const deletUser =async (req,res)=>{
    const id = req.params.id
    const {currentUserId ,currentUserAdminStatus}=req.body

    try {
        if(currentUserId===id || currentUserAdminStatus){
            await UserModel.findByIdAndDelete(id)
            res.status(200).json({message:"user succesfully deleted"})
        }else{
            res.status(400).json({message:"You can only delet your post"})
        }
    } catch (error) {
        res.status(500).json({message:"Somthings went wrong"})
    }
}

//follow a user

export const followUser =async(req,res)=>{
    const id =req.params.id

    const {currentUserId}=req.body
    if(currentUserId === id){
        res.status(403).json({message:"You cant Follow Yours self"})
    }else{
        try {
            const whomeFollow = await UserModel.findById(id)
            const whoFollow = await UserModel.findById(currentUserId)

            if(!whomeFollow.followeres.includes(currentUserId)){
                await whomeFollow.updateOne({$push:{followeres:currentUserId}})
                await whoFollow.updateOne({$push:{followings:id}})
                res.status(200).json({message:"You are following now"})
            }else{
                res.status(400).json({message:"Already following"})
            }
    
        } catch (error) {
            res.status(500).json(error)
        }
    }

}


//unfollow


export const unfollowUser =async(req,res)=>{
    const id =req.params.id

    const {currentUserId}=req.body
    if(currentUserId === id){
        res.status(403).json({message:"You cant Follow Yours self"})
    }else{
        try {
            const whomeFollow = await UserModel.findById(id)
            const whoFollow = await UserModel.findById(currentUserId)

            if(whomeFollow.followeres.includes(currentUserId)){
                await whomeFollow.updateOne({$pull:{followeres:currentUserId}})
                await whoFollow.updateOne({$pull:{followings:id}})
                res.status(200).json({message:"Unfollowed"})
            }else{
                res.status(400).json({message:"User is unfollowed by you"})
            }
    
        } catch (error) {
            res.status(500).json(error)
        }
    }

}