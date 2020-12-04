const jwt=require("jsonwebtoken");

const Employee=require("../models/user");

const auth= async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token, process.env.SECRET_KEY );
        next();

    }catch(err){
        res.status(401).send(err);
    }
}

module.exports = auth;