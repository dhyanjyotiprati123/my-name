const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/userData",{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}).then(()=>{
    console.log("connection is secure");
}).catch((err)=>{
    console.log(err);
})