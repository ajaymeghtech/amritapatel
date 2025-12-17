const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String },
    institute: { type: String },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    photo: { type: String }, // image URL
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
