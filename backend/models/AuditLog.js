const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);