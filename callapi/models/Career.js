const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
  {
     title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    short_description: { type: String },
    description: { type: String },

     image: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },          // file path
    applynow: { type: String },           // file path
    view_details: { type: String },       // file path
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Career", CareerSchema);
