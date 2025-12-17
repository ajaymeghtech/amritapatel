const mongoose = require('mongoose');

const AcademicCalendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf: { type: String, required: true },     // stored path like /uploads/academic-calendars/xxx.pdf
  years: [{ type: Number }],                 // array of years (e.g., [2023, 2024])
  description: { type: String },             // optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AcademicCalendarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AcademicCalendar', AcademicCalendarSchema);
