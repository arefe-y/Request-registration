const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:10
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre("save",function(next){
    let user = this;

    if (!user.isModified("password")) return next();
  
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
  
      user.password = hash;
      next();
    });
})



module.exports=mongoose.model("User",userSchema)