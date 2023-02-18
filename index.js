import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import AuthRoute from './Routes/AuthRouter.js'
import UserRoute from './Routes/UserRouter.js'
import PostRoute from './Routes/PostRoute.js'
//Routes

const app = express();

//Middleweres
app.use(bodyParser.json({limit:'30mb',extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb",extended: true}));

dotenv.config()

const DB=process.env.MONGO_DB;
const PORT = process.env.SERVER_PORT;


mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`Connected to the server on port ${PORT}`)))
.catch((error)=>console.log(`${error} Error` ));


app.use('/auth',AuthRoute);
app.use('/user',UserRoute);
app.use('/post',PostRoute);
