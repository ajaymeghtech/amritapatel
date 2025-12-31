const mongoose = require("mongoose");

const CampusLifeSchema = new mongoose.Schema(
  {
     title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
    description: { type: String, required: true },
     image: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampusLife", CampusLifeSchema);
