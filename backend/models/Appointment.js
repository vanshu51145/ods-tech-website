const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);