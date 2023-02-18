import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

//create a post
export const createPost =async(req,res)=>{
    const postBody = req.body;
    try {
        const newPost = await PostModel.create(postBody);
        if(newPost){
            res.status(200).json({message:"Post created",newPost});
        }else{
            res.status(400).json({message:"Post Not created"});
        }
    } catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }

}

//get Post
export const getPost = async(req,res)=>{
    const postId = req.params.id
    try {
        const post = await PostModel.findById(postId)
        if(post){
            res.status(200).json(post)
        }else{
            res.status(400).json({message:"Not found"});
        }
    } catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }
}

//update post
export const updatePost = async (req,res)=>{
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        if(post.userId === userId){
            await post.updateOne({$set : req.body});
            res.status(200).json({message:"Update succesfully"});
        }else{
            res.status(400).json({message:"You can only update your post"});
        }
        
    } catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }
}

//deletPost
export const deletPost = async(req,res)=>{
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json({message:"Post succesfully deleted"});
        }else{
            res.status(400).json({message:"You can only delet your post"});
        }
    } catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }
}


//like a post and dislike

export const likeAndDislikePost = async (req,res)=>{
    const postId = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(postId);
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}});
            res.status(200).json({message:"Post Liked"});
        }else{
            await post.updateOne({$pull:{likes:userId}});
            res.status(200).json({message:"Dislike Liked"});
        }
        
    } catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }
}

//get Timeline Post
export const timelinePost = async(req,res)=>{
    const userId = req.params.id;

    try {
        const currentUserPost = await PostModel.find({userId:userId});
        const followingPost = await UserModel.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:"posts",
                    localField:"followings",
                    foreignField:"userId",
                    as:"followingPost"
                }
            },
            {
                $project:{
                    followingPost:1,
                    _id:0
                }
            }
        ]);
        // res.status(200).json(currentUserPost.concat(followingPost));
        res.status(200).json(currentUserPost.concat(...followingPost[0].followingPost).sort((a,b)=>{
            return b.createdAt - a.createdAt;
        }));

    }catch (error) {
        res.status(500).json({message:"Somthing wrong"});
    }
}