require('dotenv').config("../.env");
const passport = require('passport');
const User=require('../model/user');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;
//login with twitter dependendent starts

// var TwitterStrategy=require('passport-twitter').Strategy;
//login with twitter dependent end




const { GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,FB_APP_ID,FB_APP_SECRET }=process.env;


//serialising and deserialising user
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, user);
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  



//login with google stratefy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/googleLogin/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOne({email:profile._json.email})
    .then(user=>{
        if(user)
        {
            cb(null,user)
        }
        else{

            User.create({email:profile._json.email,typeAuth:"google"})
            .then(user=>{
                cb(null,user)
            })
            .catch(err=>{
                console.log(err);
            });

        }
    });

    
  }
));

//login with facebook strategy
passport.use(new FacebookStrategy({
    clientID: FB_APP_ID,
    clientSecret: FB_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebookLogin/callback",
    profileFields:['email']
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log(profile);
    console.log(profile._json.email);
    User.find({ email:profile._json.email }, function (err, user) {
      return cb(err, user);
    });
  }
));


