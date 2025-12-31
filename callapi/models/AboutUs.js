const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema(
  {
  title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    slug: { type: String, unique: true }, // auto generated
    short_description: { type: String },
    content: { type: String, required: true },
    image: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },          // banner or main image
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);
