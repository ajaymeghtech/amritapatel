const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
     title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    subtitle: String,
    description: String,
    image: { type: String, required: true },
    link: {
  type: String,
  match: [
    /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
    "Please enter a valid URL",
  ],
},

    altText: String,
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    position: { type: String, default: "homepage" },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
