require('dotenv').config();
const express=require("express");
const path = require("path");
const hbs=require("hbs");
require("./db/connection");
const Employee=require("./models/user");
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser");
const auth = require("./middleware/auth");

const port=process.env.PORT || 3000
const static_path= path.join(__dirname,"./public");
const partial_path=path.join(__dirname, "./templates");

const app=express();

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set("view engine","hbs");
app.use(cookieParser());

hbs.registerPartials(partial_path);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.get("/secret",auth,(req,res)=>{
    res.render("secret");
})

app.get("/logout", auth , async(req, res)=>{
    try{
    //    logout from single device
       req.User.tokens=req.User.tokens.filter((currentElement)=>{
           return currentElement.token !== req.token;
       })

    //    logout from multiple device
      
        // req.User.tokens=[];

        res.clearCookie("jwt");
        await req.User.save();
        res.render("login");
        console.log("logout successfully");
    }catch(err){
        res.status(500).send(err)
    }
})

app.post("/signup",async(req,res)=>{
    try{
       const password=req.body.password;
       const cpassword=req.body.Confirmpassword ;
       if (password===cpassword){
          const insertUser= new Employee({
            fname: req.body.firstname,
            lname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: password,
            confirmpassword: cpassword
          })

          const token=await insertUser.generateAuthToken();

          const createUser=await insertUser.save();
          res.status(201).render("index");
       }else{
           res.send("passwor not matching")
       }
       
    }catch(err){
        res.status(400).send(err)
    }
})

app.post("/login", async(req,res)=>{
    try{
        const Email=req.body.email;
        const Password=req.body.password;
        
        const getUser=await Employee.findOne({email: Email});

        const isMatch=await bcrypt.compare(Password, getUser.password);
        
        const token=await getUser.generateAuthToken();
    
        res.cookie("jwt", token);

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("invalid details");
        }

    }catch(err){
        res.status(400).send(err)
    }
})

app.listen(port,()=>{
    console.log("server is started");
})