const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator: (value)=>{
                return validator.isStrongPassword(value,{
                    minLength:6,
                    minLowercase:3,
                    minNumbers:1,
                    minUppercase:1,
                    minSymbols:1
                })
            },
            message:'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    email:{
        type:email,
        required:true,
        unique:true,
    }
});

const User=mongoose.model('User',userSchema);

mongoose.model=User;
