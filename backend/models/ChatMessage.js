const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    sender: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);