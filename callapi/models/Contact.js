const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"],
  },

  lastName: {
    type: String,
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },

  phone: {
    type: String,
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number",
    ],
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },

  institute: {
    type: String,
    required: true,
    trim: true,
    maxlength: [150, "Institute name cannot exceed 150 characters"],
  },

  course: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Course name cannot exceed 100 characters"],
  },

  status: {
    type: String,
    enum: ["new", "seen"],
    default: "new",
  },
}
,
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
