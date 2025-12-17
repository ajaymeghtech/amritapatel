const mongoose = require("mongoose");

const videoTestimonialSchema = new mongoose.Schema(
  {
    activityId: { type: String, required: true },  // OK
    title: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },
    video_url: { type: String ,required: true}, 
    image: { type: String ,required: true}, 
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.VideoTestimonial ||
  mongoose.model("VideoTestimonial", videoTestimonialSchema); 