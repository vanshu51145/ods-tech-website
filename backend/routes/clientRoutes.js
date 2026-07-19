const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const Client=require("../models/Client");
const jwt=require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: client.email,
  subject: "Welcome to ODS Network",
  html: `
    <h2>Welcome to ODS Network 🎉</h2>

    <p>Hello ${client.name},</p>

    <p>
      Thank you for registering with ODS Network.
    </p>

    <p>
      Your account has been created successfully.
    </p>

    <p>
      We are excited to work with you.
    </p>

    <br>

    <b>Regards</b><br>
    ODS Network Team
  `,
});

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