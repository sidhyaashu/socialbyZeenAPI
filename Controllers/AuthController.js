import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

//Register a new user
export const registerUser = async(req,res)=>{

    const {username,password,firstname,lastname}= req.body;

    try {
        const existingUser = await UserModel.findOne({username:username});
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);
            const newUser = await UserModel.create({username,password:hashPassword,firstname,lastname});
            // await newUser.save()
            res.status(200).json({message:"User Created",newUser}) 
        }else{
            res.status(400).json({message:"User Already Exist"}) 
        }
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Login User 

export const loginUser = async(req,res)=>{
    const {username,password}= req.body;

    try {
        const userExist = await UserModel.findOne({username:username})
        if(userExist){
            const validity = await bcrypt.compare(password,userExist.password)
            validity ? res.status(200).json({message:"Login Succesfull",userExist}):res.status(400).json("Wrong Password")
        }else{
            res.status(404).json("User dos't wxist")

        }
    } catch (error) {
        res.status(400).json("Invalid credentials")
    }

}