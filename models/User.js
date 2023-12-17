const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const validator=require('validator');


const userSchema=new mongoose.Schema({
    username:{
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
    applications:[{
        type: mongoose.Schema.Types.ObjectId,  
        ref:'Application'
    }]
});

//save the user if it doesn't exist
userSchema.pre('save', async function(next){
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(this.password,salt);
        this.password=hashedPassword;
        next();   
    }
    catch(error){
        next(error);
    }
});

//method to delete the User
userSchema.methods.deleteUser=async function(){
    try{
        await this.deleteOne();
    } catch(error){
        throw new Error(error.message);
    }
};

//method to change the user password
userSchema.methods.changePassword=async function(new_password){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(new_password,salt);
        this.password=hashedPassword;
        await this.save();
    } catch(error){
        throw new Error(error.message);
    }
};

const User=mongoose.model('User',userSchema);

module.exports=User;
