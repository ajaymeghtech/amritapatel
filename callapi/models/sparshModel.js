const mongoose = require("mongoose");

const SparshSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SparshModel ||
  mongoose.model("SparshModel", SparshSchema);

