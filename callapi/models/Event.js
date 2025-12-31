const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [150, "Name cannot exceed 150 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    trim: true,
    maxlength: [200, "Location cannot exceed 200 characters"],
  },

  author: {
    type: String,
    trim: true,
    maxlength: [100, "Author name cannot exceed 100 characters"],
  },

  image: {
    type: String,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG, JPG, or JPEG images are allowed",
    },
  },
}
,
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
