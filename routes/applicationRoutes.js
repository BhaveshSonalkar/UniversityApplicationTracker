const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');

router.post('/:userId/add-application', async (req,res)=>{
    const userId=req.params.userId;
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
        const user=await User.findOne({_id:userId});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        const existingApplication = await Application.findOne({
            userId: user._id,
            university_name,
            location,
            course,
            degree,
        });
        
        if(existingApplication){
            return res.status(400).json({message: "Application already exists"});
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


router.patch('/:userId/update-application/:applicationId',async(req,res)=>{
    const userId= req.params.userId;
    const applicationId=req.params.applicationId;

    const updateFields={
        university_name:req.body.university_name,
        location:req.body.location,
        course:req.body.course,
        degree:req.body.degree,
        deadline:req.body.deadline,
        application_link:req.body.application_link,
        application_status: req.body.application_status,
    };

    try{
        const user=await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const existingApplication=await Application.findOne({
            _id:applicationId,
            userId:user._id
        });

        if(!existingApplication){
            return res.status(404).json({message:'Application not found'});
        }
        
        //update only the specified fields
        for (const key in updateFields) {
            if (updateFields[key] !== undefined) {
                existingApplication[key] = updateFields[key];
            }
        }
        
        //save the updated application
        await existingApplication.save();

        res.status(200).json({message:'Application updated successfully'});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

router.delete('/:userId/delete-application/:applicationId',async(req,res)=>{
    const userId=req.params.userId;
    const applicationId=req.params.applicationId;

    try{
        const user=await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const application=await Application.findOne({
            _id:applicationId,
            userId:userId
        });

        if(!application){
            return res.status(404).json({message:'Application not found'});
        }

        //delete the application
        await application.deleteOne();

        //remove the application id from the user's applications array
        const index=user.applications.indexOf(applicationId);
        user.applications.splice(index,1);
        await user.save();

        res.status(200).json({message:'Application deleted successfully'});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});


module.exports=router;