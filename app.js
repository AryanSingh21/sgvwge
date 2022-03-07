//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongooose= require("mongoose");
const { default: mongoose } = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const app = express();



app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongooose.Schema({
    email : String,
    password : String,
})
console.log(md5(12345));
// console.log(process.env.SECRET);

// userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ["password"]})

const User = mongooose.model("User" , userSchema)

app.get("/" ,function(req ,res){
    res.render("home")
})
app.get("/login" , function(req ,res){
    res.render("login")
})
app.get("/register" ,function(req , res){
    res.render("register")
})

app.post("/register" , function(req , res){
    const newuser = new User({
        email : req.body.username,
        password : md5(req.body.password),
    })
    newuser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })
})

app.post("/login" , function(req , res){
    const userN = req.body.username
    const passW = md5(req.body.password)

    User.findOne({email : userN} ,function(err , founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser.password===passW){
                res.render("secrets")
            }
        }
    })
    
})











app.listen("3000" , function(err){
    console.log("server running on 3000");
})