const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");

const Client=require("../models/Client");
const jwt=require("jsonwebtoken");
router.post("/register",async(req,res)=>{

try{

const {name,company,email,password}=req.body;

const exists=await Client.findOne({email});

if(exists){

return res.json({
success:false,
message:"Email already exists"
});

}

const hash=await bcrypt.hash(password,10);

const client=new Client({

name,
company,
email,
password:hash

});

await client.save();

res.json({

success:true,
message:"Registration Successful"

});

}catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

});
router.post("/login",async(req,res)=>{

try{

const {email,password}=req.body;

const client=await Client.findOne({email});

if(!client){

return res.json({

success:false,
message:"Invalid Credentials"

});

}

const match=await bcrypt.compare(
password,
client.password
);

if(!match){

return res.json({

success:false,
message:"Invalid Credentials"

});

}

const token=jwt.sign(

{
id:client._id
},

process.env.JWT_SECRET,

{
expiresIn:"1d"
}

);

res.json({

success:true,
token,
client

});

}catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

});
module.exports=router;