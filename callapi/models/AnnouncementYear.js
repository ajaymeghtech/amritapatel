const mongoose = require("mongoose");

const AnnouncementYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnnouncementYear", AnnouncementYearSchema);
