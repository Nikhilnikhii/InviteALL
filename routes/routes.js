const router=require('express').Router();


router.get("/dummy",(req,res)=>{
    res.send("welcome to dummy route in router");
});









module.exports=router;