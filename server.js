//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User=require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

//Database Connection
mongoose.connect('mongodb://localhost:27017/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

//Middleware
app.use(cors());
app.use(express.json());

//Define routes
app.get('/',(req,res)=>{
    res.send('University Tracking API by @bhavesh');
});

app.post('/api/register',async (req,res)=>{
    const {username, password}=req.body;

    try{
        //check if the username already exists
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "Username already exists"});
        }

        const newUser=new User({username, password});
        await newUser.save();

        res.status(201).json({message: "User registered successfully"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

app.delete('/api/delete/:username', async(req, res)=>{
    const {username} =req.params;

    try{
        //find the user by username
        const user=await User.findOne({username});
        
        //if the user does not exist, return an error
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        //delete the user
        await user.deleteUser();

        res.status(200).json({message: "User deleted successfully"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
});



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});