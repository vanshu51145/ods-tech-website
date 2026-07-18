const express = require("express");
const router = express.Router();

const Subscriber = require("../models/Subscriber");
const auth = require("../middleware/auth");

router.post("/subscribe", async(req,res)=>{

try{

const {email}=req.body;


if(!email){
 return res.status(400).json({
  success:false,
  message:"Email is required"
 });
}


// duplicate check

const existingSubscriber =
await Subscriber.findOne({email});


if(existingSubscriber){

 return res.json({
  success:false,
  message:"You are already subscribed!"
 });

}



const subscriber =
new Subscriber({
 email
});


await subscriber.save();


res.json({

 success:true,
 message:"Subscribed successfully!"

});


}
catch(error){

res.status(500).json({

 success:false,
 message:error.message

});

}


});


router.get("/subscribers", auth, async(req,res)=>{

  try{

    const subscribers = await Subscriber.find()
      .sort({subscribedAt:-1});


    res.json({

      success:true,
      subscribers

    });


  }
  catch(error){

    res.status(500).json({

      success:false,
      message:error.message

    });

  }

});


module.exports = router;