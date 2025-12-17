const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // auto generated
    short_description: { type: String },
    content: { type: String, required: true },
    image: { type: String }, // optional file support later
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);
