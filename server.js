//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

//Database Connection
mongoose.connect('mongodb://localhost:27017/mydb').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

//Middleware
app.use(cors());
app.use(express.json());

const userRouter= require('./routes/userRoutes');
app.use('/user',userRouter);

const ApplicationRouter=require('./routes/applicationRoutes');
app.use('/application',ApplicationRouter);

//Define routes
app.get('/',(req,res)=>{
    res.send('University Tracking API by @bhavesh');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});