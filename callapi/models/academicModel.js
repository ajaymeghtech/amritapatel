const mongoose = require("mongoose");

const AcademicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    subtitle: { type: String },
    content: { type: String, required: true },
    image: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true; // allow empty
          return /\.(png|jpg|jpeg)$/i.test(value);
        },
        message: "Only PNG and JPG images are allowed",
      },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Academic", AcademicSchema);
