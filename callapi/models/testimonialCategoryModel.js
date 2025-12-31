const mongoose = require("mongoose");

// Sub-schema for Testimonials
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  institute: { type: String },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  photo: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  sortOrder: { type: Number, default: 0 },
}, { _id: true, timestamps: true });

// Sub-schema for Videos
const TestimonialVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  video_url: { type: String, required: true },
  thumbnail: { type: String },
  description: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  sortOrder: { type: Number, default: 0 },
}, { _id: true, timestamps: true });

const TestimonialCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sortOrder: { type: Number, default: 0 },
    testimonials: [TestimonialSchema],
    videos: [TestimonialVideoSchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TestimonialCategory ||
  mongoose.model("TestimonialCategory", TestimonialCategorySchema);

