import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import {User} from "../models/User.js"
router.post("/signup",async(req,res)=>{
    const{username,email,password} = req.body;
    const user =await User.findOne({email});
    if(user){
        return res.json({message:"user exists already!"})
    }
    const hashpassword = await bcrypt.hash(password,10)
    const newUser = new User({
        username,
        email,
        password:hashpassword,
    })
    await newUser.save()
    return res.json({status:true,message: "record registered"})
})
router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({message:"user is not registered"})
    }
    const validPassword = await bcrypt.compare(password,user.password)
    if(!validPassword){
        return res.json({message:"password is incorrect"})
    }
     const token = jwt.sign({username: user.username},process.env.KEY,{expiresIn:"1h"})
     res.cookie("token",token,{httpOnly:true,maxAge:36000})
     return res.json({status:true,message:"login successfully!"})
})
const verifyUser = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.json({status:false,message:"no token"});
        }
        const decoded = await jwt.verify(token,process.env.KEY);
        next()
    }
    catch(err){
        return res.json(err);
    }
}
router.get("/verify",verifyUser,(req,res)=>{
    return res.json({status:true,message:"authorized"})
});
router.get("/logout",(req,res)=>{
    res.clearCookie("token")
    return res.json({status:true})
})

export {router as UserRouter}