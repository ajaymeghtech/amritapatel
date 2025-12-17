const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },

    image: { type: String },              // file path
    applynow: { type: String },           // file path
    view_details: { type: String },       // file path
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Career", CareerSchema);
