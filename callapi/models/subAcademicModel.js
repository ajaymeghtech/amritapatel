const mongoose = require("mongoose");

const SubAcademicSchema = new mongoose.Schema(
  {
    academicId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String }, // Keep for backward compatibility
    images: [{ type: String }], // Array of image paths
    eventType: { type: String },
    leadFacilitator: { type: String },
    venueAffiliation: { type: String },
    coFacilitator: { type: String },
    date: { type: Date },
  },
  { timestamps: true }
);

// ✅ FIX: Prevent OverwriteModelError
module.exports =
  mongoose.models.SubAcademicModel ||
  mongoose.model("SubAcademicModel", SubAcademicSchema);
