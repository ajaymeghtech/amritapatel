const mongoose = require("mongoose");

const TestimonialVideoSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestimonialCategory",
      required: true,
    },
    title: { type: String, required: true },
    video_url: { type: String, required: true },
    thumbnail: { type: String }, // image URL for video thumbnail
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TestimonialVideo ||
  mongoose.model("TestimonialVideo", TestimonialVideoSchema);

