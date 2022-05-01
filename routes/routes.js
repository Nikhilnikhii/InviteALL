const router=require('express').Router();
const passport = require('passport');
require("../passport/passport");

//login with google starts here
router.get("/googleLogin",passport.authenticate('google',{scope:['email','profile']}),(req,res)=>{

    res.send("welcome to login with google");
});

//login with google callback
router.get("/googleLogin/callback",passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{

    console.log("in google callback route",req.user);
    // TODO: generating a token and passing via token
    res.send("welcome to login with google callback");
});




//login with facebook starts here
router.get("/facebookLogin",passport.authenticate('facebook'),(req,res)=>{

    res.send("welcome to login with facebook");
});

//login with facebook callback
router.get("/facebookLogin/callback",passport.authenticate('facebook',{failureRedirect:"/"}),(req,res)=>{
    console.log("in login with facebook callback route",req.user);
    res.send("welcome to login with facebook callback");
});




module.exports=router;