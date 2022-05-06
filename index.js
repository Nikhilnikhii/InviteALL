require("dotenv").config();
require('./config/database');
const { application } = require('express');
const express = require('express');
const session=require('express-session');


const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
//const cookieSession=require('cookie-session');


const ejs=require('ejs');

const User=require("./model/user");
const route=require("./routes/routes");

const Auth=require("./middleware/auth");



const { SECRET_KEY }=process.env;
//connection configurations


const app=express();

//middlewares

//app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:SECRET_KEY,
    resave:false,
    saveUninitialized:false,

}));
// app.use(cookieSession({
//     name:"session",
//     keys:[SECRET_KEY],
//     maxAge:24*60*60*1000
// }));
app.use(cookieparser());
app.use(express.json());

app.use("/auth",route);

//app.use(session({secret:SECRET_KEY}));

app.set("view engine","ejs");



//routes start here

//homepage route
app.get("/",(req,res)=>{

    res.render("home");
    //res.send("welcome to home page");
});

//traditional register route
app.post("/register",async (req,res)=>{

    try {
        const { typeAuth }=req.body;

        if (typeAuth=='traditional'){
            const { email,name,pwd,cpwd }=req.body;

            if(email)
            {
                var UserExsist= await User.findOne({email});
            }

            if(!(email && name && pwd && cpwd))
            {
                res.send("all fields are required");
            }
            else if(UserExsist)
            {
                // TODO: need to redirect user to login page
                res.send("User Already Exsists");
            }
            else{

                //  hashing a password
                const hashedPwd=bcryptjs.hashSync(pwd,10);

                const Ob=await User.create({
                    email,
                    password:hashedPwd,
                    name,
                    typeAuth:typeAuth
                });

                Ob.password=undefined;

              
                console.log(Ob);
                res.send("user registered succesfully");
                // TODO: post succesfull registration redirect user to login page

            }
            
        }
        
    } catch (error) {
        console.log(error);
    }

    //res.send("register route");
});

//traditional login route
app.post("/login",async (req,res)=>{

    try {
        const { typeAuth }=req.body;
        if (typeAuth=='traditional')
        {
            const { email,pwd }=req.body;

            if(!(email && pwd)){
                res.send("all fields are required");
            }else{
                const UserExsist=await User.findOne({email});

                if(!(UserExsist)){
                    res.send("user account doesn't exsists please register");
                    // TODO: redirect user to register page
                }
                else if(!(bcryptjs.compareSync(pwd,UserExsist.password))){
                    res.send("incorrect password");
                }
                else{
                    UserExsist.password=undefined;

                    //generate a token
                    const tokn=jsonwebtoken.sign({email},SECRET_KEY,{expiresIn:"2h"});

                    // var decoded=jsonwebtoken.verify(tokn,SECRET_KEY);
                    // console.log("token decoded is ",decoded);

                    // pass token via cookies

                    const options={
                        expires:new Date(Date.now()+3*24*60*60*1000),
                        httpOnly:true
                    };
                    
                    console.log("user logged in succesfully");
                    res.status(200).cookie('token',tokn,options).json({
                        "success":true,
                        UserExsist
                    });
                    
                    
                    //res.send("user logged in succesfully");
                }
            }
        }
        
    } catch (error) {
        console.log(error);
    }
    //res.send("login route");
});





//dashboard route
app.get("/dashboard",Auth,(req,res)=>{
    res.send("Dashboard route");
});

//dashboard2 route
app.get('/dashboard2',Auth,(req,res)=>{
    res.send("dashboard2 route")
});

app.get("/logout",(req,res)=>{
    console.log("user logged out succesfully");
    
    // TODO: need to handle clearing cookies
    res.clearCookie('token').send("user logged out succesfully");
});

module.exports=app;