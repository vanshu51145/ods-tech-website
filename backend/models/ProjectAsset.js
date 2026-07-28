const mongoose = require("mongoose");

const projectAssetSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      default: "raw",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectAsset",
  projectAssetSchema
);