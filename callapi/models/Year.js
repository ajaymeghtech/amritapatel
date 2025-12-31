const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      unique: true,
      match: [/^(19|20)\d{2}$/, "Please enter a valid year"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Year", yearSchema);
