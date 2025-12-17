const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    subtitle: { type: String },

    short_description: { type: String },

    description: { type: String },

    year_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Year",
      required: true
    },

    date: { type: String },

    image: { type: String },       // file URL or name

    video: { type: String }        // file URL or youtube link
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
