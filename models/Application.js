const mongoose=require('mongoose');

const applicationSchema=new mongoose.Schema({
    university_name:{
        type:String,
        required:true
    },
    location:{
        city:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    },
    course:{
        course_name:{
            type:String,
            required:true
        },
        course_duration:{
            type: Number,
            required:true
        },
        course_fee:{
            type:Number
        }
    },
    degree:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    application_link:{
        type:String
    },
    application_status:{
        type:String
    }
});

const Application=mongoose.model('Application',applicationSchema);

module.exports = Application;