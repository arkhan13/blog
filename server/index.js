const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const config = require('./config/key')
const jwt = require("jsonwebtoken")

const { User } = require("./models/User");
const {auth} = require("./middleware/auth") 

mongoose
  .connect(
    config.mongoURI,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("connected db"))
  .catch((err) => console.log(err));



  app.use(cors())
  app.use(cookieParser());

  //to not get any deprecation warning or error
  //support parsing of application/x-www-form-urlencoded post data
  app.use(express.json({extended:false}))
  //to get json data
  // support parsing of application/json type post data
 


app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
      id:req._id,
      isAuth:true,
      email:req.user.email,
      name:req.user.name,
      lastname:req.user.lastname,
      role:req.user.role,
    })
  });

  app.get("/api/user/au", (req, res) => {
    let token = req.cookies.x_auth;
    res.json({token:token})
  });

  app.get("/api/user/getcollection", (req, res) => {
    User.findOneAndRemove({_id:'5ec8753034d48e36acdfa667'}).then(function(res){
      console.log(res)
    })
  });

app.post("/api/user/register", (req, res) => {
  console.log(req.body)
  const user = new User(req.body);
  
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success:true,
      message:"successfully registered user"
    });
  });
  // res.send("welcome to my blog");
});


app.post("/api/user/login",(req,res)=>{
  //find the email
  User.findOne({email:req.body.email},(err,user)=>{
    if(!user)
    
      return res.json({
        loginsuccess:false,
        message:"no user found"
      })
      
      //compare password
     user.comparePassword(req.body.password,(err,isMatch)=>{
       if(!isMatch){
         return res.json({
           loginsuccess:false,
           message:"wrong password"
         })
       }
      
     })

     //generate token
     user.generateToken((err,user)=>{
       if(err) return res.status(400).send(err)
       res.cookie("x_auth", user.token).status(200).json({loginsuccess:true,userId: user._id,token:user.token})
     })
  })
  
  
  
})

app.get("/api/user/logout",auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id}, {token:''} , (err,doc)=>{
    if(err) return res.json({success:false,err})
    return res.status(200).send({
      logoutsuccess:true
    })
  })
})

app.get("/",(req,res)=>{
  res.send({message:"homepage"})
})

console.log("try");
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server starting ${PORT}`))
