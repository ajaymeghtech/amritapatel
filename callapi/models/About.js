const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  image: { type: String },            // banner or main image
  gallery: [{ type: String }],        // array of images
  videoLink: { type: String },        // optional video URL
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
