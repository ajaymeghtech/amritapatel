const mongoose = require("mongoose");

const ThirdAcademicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subAcademicIds: [{ type: String }], // Array of Sub-Academic IDs
    images: [{ type: String }], // Array of image paths
  },
  { timestamps: true }
);

// ✅ FIX: Prevent OverwriteModelError
module.exports =
  mongoose.models.ThirdAcademicModel ||
  mongoose.model("ThirdAcademicModel", ThirdAcademicSchema);

