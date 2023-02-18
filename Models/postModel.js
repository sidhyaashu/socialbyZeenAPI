import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{type:String},
    likes:[],
    image:String,

},{timestamps:true}) ;

const PostModel = mongoose.model('Post',PostSchema);

export default PostModel