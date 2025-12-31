const mongoose = require("mongoose");

const bannerLinkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // Example: "Admission Open 2025 – Apply Now"
  },
  link: {
  type: String,
  match: [
    /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
    "Please enter a valid URL",
  ],
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BannerLink", bannerLinkSchema);
