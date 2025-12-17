const mongoose = require("mongoose");

const StudentLifePDFSchema = new mongoose.Schema({
  student_life_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentLife",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  pdf: {
    type: String,
    required: true
  },

  

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

StudentLifePDFSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("StudentLifePDF", StudentLifePDFSchema);
