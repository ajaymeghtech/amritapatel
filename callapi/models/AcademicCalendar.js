const mongoose = require('mongoose');

const AcademicCalendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf: {
  type: String,
  required: true,
  validate: {
    validator: function (value) {
      return /\.pdf$/i.test(value);
    },
    message: "Only PDF files are allowed",
  },
},  // stored path like /uploads/academic-calendars/xxx.pdf
  year: {
      type: String,
      required: true,
      unique: true,
      match: [/^(19|20)\d{2}$/, "Please enter a valid year"],
    },              // array of years (e.g., [2023, 2024])
  description: { type: String },             // optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AcademicCalendarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AcademicCalendar', AcademicCalendarSchema);
