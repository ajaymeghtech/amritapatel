const mongoose = require("mongoose");

const AnnouncementImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: { type: String },
  description: { type: String },
   image: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },
  announcement_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Announcement",
    required: true
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AnnouncementImageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("AnnouncementImage", AnnouncementImageSchema);
