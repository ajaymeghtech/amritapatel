const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true }, // YouTube/Vimeo/website URL
    date: { type: Date, default: Date.now }, // When video is added/published
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
