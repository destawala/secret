//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');


const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret=process.env.SECRET;
userSchema.plugin(encrypt, { secret:secret,encryptedFields:['password']});

const User=new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.route("/login")
.get((req,res)=>{
  res.render("login");
})
.post((req,res)=>{
  const userName=req.body.username;
  const password=req.body.password;

  User.findOne({email:userName},(err,foundUser)=>{
    if (!err) {
      if (foundUser) {
        if (foundUser.password===password) {
          res.render("secrets");
        } else {
          res.send("password incorrect");
        }
      } else {
        res.send("username not found");
      }
    } else {
      res.send(err);
    }
  })
})
;


app.route("/register")
.get((req,res)=>{
  res.render("register");
})
.post((req,res)=>{
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save((err)=>{
    if(!err){
      res.render("secrets")
    }
    else{}
    res.send(err);
  });


})
;
