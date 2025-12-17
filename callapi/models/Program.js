const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },            // Example: "Medicine"
  description: { type: String },                      // Optional short description
  image: { type: String },                            // Card background image
  iconImage: { type: String },                        // Small icon (optional)
  courses: [{ type: String }],                        // ["MBBS", "MD/MS", "DM", "DNB"]
  link: { type: String },                             // Example: "/courses/medicine"
  category: { type: String },                         // Example: "Medical Science"
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },         // Show/hide
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Program", programSchema);
