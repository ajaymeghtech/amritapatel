const mongoose = require("mongoose");

const FieldTestimonialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    shortDescription: { type: String },
    designation: { type: String },
    videos: [{ type: String }], // array of video URLs
    subTestimonials: [
      {
        title: { type: String },
        shortDescription: { type: String },
        designation: { type: String },
        faculty: { type: String },
        description: { type: String },
        videos: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FieldTestimonialModel ||
  mongoose.model("FieldTestimonialModel", FieldTestimonialSchema);

