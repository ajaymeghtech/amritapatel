const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    author: { type: String },
    image: { type: String }, // store image filename or path
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
