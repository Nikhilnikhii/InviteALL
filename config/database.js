const mongoose = require('mongoose');
const { MongoDB_URL }=process.env;


module.exports=mongoose.connect(MongoDB_URL)
.then(()=>{
    console.log("DB connected succesfully");
})
.catch((error)=>{
    console.log(Error);
});