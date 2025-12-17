const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortTitle: { type: String },            // optional shorter label like "Merit List 2025-2026"
  icon: { type: String },                  // URL or icon class name
  content: { type: String },               // full announcement body / description
  category: { type: String, default: 'general' }, // e.g., "Merit List", "Counseling"
  startDate: { type: Date },               // optional visible-from
  endDate: { type: Date },                 // optional visible-until
  link: { type: String },                  // optional link
  // NEW: calendar date for the announcement
  date: { type: Date },
  location: { type: String },             // NEW
  image: { type: String }, 
  image_url: { type: String },
  announcement_year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AnnouncementYear",
    required: true
  },

  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AnnouncementImage",
  }],


  isPublished: { type: Boolean, default: true },
  meta: { type: Object },                  // extra metadata if needed

  // keep explicit timestamps (you can switch to `timestamps: true` if preferred)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// update updatedAt automatically
AnnouncementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
