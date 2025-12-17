const mongoose = require("mongoose");

const StudentLifeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    short_description: { type: String },
    description: { type: String },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentLifeImage" }],
    pdfs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "StudentLifePDF" }
    ],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentLife", StudentLifeSchema);
