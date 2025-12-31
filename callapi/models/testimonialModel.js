const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestimonialCategory",
      required: true,
    },
    name: { type: String, required: true },
    designation: { type: String },
    institute: { type: String },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    photo: { type: String }, // image URL
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);

