const mongoose = require("mongoose");

const pressReleaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publisher: { type: String },
    date: { type: String },  // Example: "14 Aug"
    year: { type: Number },  // Example: 2024
    image: { type: String, required: true },
    description: String,
    press_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "PressYear" },
    order: { type: Number, default: 0 },

    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PressRelease", pressReleaseSchema);
