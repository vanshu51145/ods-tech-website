const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    serviceRequested: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    status: {
  type: String,
  enum: ["New", "Contacted", "Converted"],
  default: "New",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);