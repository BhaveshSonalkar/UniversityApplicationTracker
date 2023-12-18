const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');

router.post('/register', async (req,res)=>{
    const {username, password}=req.body;
    try{
        //check if the username already exists
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "Username already exists"});
        }

        const newUser=new User({username, password});
        await newUser.registerUser();

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
    });
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/delete/:userId', async (req,res)=>{
    const userId=req.params.userId;
    try{
        const user=await User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        //delete all the applications of the user
        for(const applicationid in user.applications){
            const application=await Application.findOne({_id: applicationid});
            if(application){
                await application.deleteOne();
            }
        }

        //delete the user ()
        await user.deleteOne();
        res.status(200).json({message: "User deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.put('/update-password/:userId', async (req,res)=>{
    const userId=req.params.userId;
    const {password}=req.body;

    try{
        const user=await User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        //change the password
        await user.changePassword(password);
        res.status(200).json({message: "Password updated successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

module.exports=router;


