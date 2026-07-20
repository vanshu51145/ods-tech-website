const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
{
  clientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Client",
    required:true
  },

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
  },

  dueDate:{
    type:Date,
  },

  isCompleted:{
    type:Boolean,
    default:false
  }

},
{
  timestamps:true
}
);


module.exports = mongoose.model(
  "Milestone",
  milestoneSchema
);