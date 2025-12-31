// models/StudentLifeImage.js
const mongoose = require("mongoose");

const StudentLifeImageSchema = new mongoose.Schema({
  student_life_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentLife",
    required: true
  },

  title: { type: String, required: true },
  short_description: { type: String, default: "" },
  description: { type: String, default: "" },
  sortOrder: { type: String, default: "" },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

StudentLifeImageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("StudentLifeImage", StudentLifeImageSchema);
