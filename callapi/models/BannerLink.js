const mongoose = require("mongoose");

const bannerLinkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // Example: "Admission Open 2025 – Apply Now"
  },
  link: {
    type: String,
    required: true, // Example: "/apply-now"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BannerLink", bannerLinkSchema);
