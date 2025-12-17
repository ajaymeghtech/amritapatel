const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
      firstName: { type: String, required: true },
    lastName: { type: String },   
    email: { type: String, required: true },
    phone: { type: String },
    // subject: { type: String, required: true },
    message: { type: String, required: true },
    institute: { type: String, required: true },
    course: { type: String, required: true },
    status: { type: String, enum: ["new", "seen"], default: "new" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
