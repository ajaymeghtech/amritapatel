const mongoose = require("mongoose");

const SubAcademicSchema = new mongoose.Schema(
  {
    academicId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

// ✅ FIX: Prevent OverwriteModelError
module.exports =
  mongoose.models.SubAcademicModel ||
  mongoose.model("SubAcademicModel", SubAcademicSchema);
