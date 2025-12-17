const mongoose = require("mongoose");

const PressYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PressYear", PressYearSchema);
