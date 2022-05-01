const jsonwebtoken = require('jsonwebtoken');
const { SECRET_KEY }=process.env;

const isAuth=(req,res,next)=>{
    const token=req.cookies.token;

    if(!(token)){
        res.send("token is missing so user hasn't logged in");
        // TODO: Redirect user to Home page


    }
    else{
        try {
            
            const decode=jsonwebtoken.verify(token,SECRET_KEY);


        } catch (error) {
            console.log(error);
        }

        next();
    }

    
};

module.exports=isAuth;