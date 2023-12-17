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

        res.status(201).json({message: "User registered successfully"});
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/delete/:username', async (req,res)=>{
    const {username}=req.params;
    try{
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        await user.deleteOne();
        res.status(200).json({message: "User deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.put('/update-password/:username', async (req,res)=>{
    const {username}=req.params;
    const {password}=req.body;

    try{
        const user=await User.findOne({username});

        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        await user.changePassword(password);
        
        res.status(200).json({message: "Password updated successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.post('/:username/add-application', async (req,res)=>{
    const userId=req.params.username;
    const{
        university_name,
        location,
        course,
        degree, 
        deadline,
        application_link,
        application_status,
    }=req.body;
    
    try{
        const user=await User.findOne({username:userId});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        const newApplication=new Application({
            userId:user._id,
            university_name,
            location,
            course,
            degree,
            deadline,
            application_link,
            application_status,
        });
        //save the application to the database
        await newApplication.save();
        user.applications.push(newApplication._id);
        await user.save();
        res.status(201).json({message: "Application added successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    };  
});


module.exports=router;


