const mongoose = require("mongoose");

const homeGallerySchema = new mongoose.Schema({
  title: { type: String, },
  image: { type: String }, // image file or URL
  description: { type: String },
  link: { type: String }, // optional link if clicking the image redirects
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HomeGallery", homeGallerySchema);
