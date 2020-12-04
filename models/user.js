const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    lname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        trim:true,
        unique:true
    }, 
    password:{
        type:String,
        required:true 
    },
    confirmpassword:{
        type:String,
        required:true 
    },
    tokens:[{
        token:{
            type:String,
             required:true 
        },
    }]
})

userSchema.methods.generateAuthToken= async function(){
    try{
      const token= jwt.sign({_id:this._id}, process.env.SECRET_KEY);
      this.tokens=this.tokens.concat({token});
      await this.save();
      return token;
    }catch(err){
       res.send(err);
    }
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
        this.confirmpassword=await bcrypt.hash(this.confirmpassword, 10);
    }
    next();
})

const Employee=new mongoose.model("Employee", userSchema);

module.exports=Employee;