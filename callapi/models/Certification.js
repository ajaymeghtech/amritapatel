const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    description: String,
    logo: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
