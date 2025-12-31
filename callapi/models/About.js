const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
  subtitle: { type: String },
  content: { type: String, required: true },
  image: {
  type: String,
  validate: {
    validator: function (value) {
      return /\.(png|jpg|jpeg)$/i.test(value);
    },
    message: "Only PNG and JPG images are allowed",
  },
},          // banner or main image
  gallery: [{ type: String }],        // array of images
 videoLink: {
  type: String,
  validate: {
    validator: function (value) {
      return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(value);
    },
    message: "Please enter a valid URL",
  },
},
    // optional video URL
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
