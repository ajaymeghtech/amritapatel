const mongoose = require("mongoose");

const FieldGallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // array of image paths
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FieldGalleryModel ||
  mongoose.model("FieldGalleryModel", FieldGallerySchema);

