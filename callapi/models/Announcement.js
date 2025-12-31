const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
   title: { type: String, required: true , maxlength: [200, "Title cannot exceed 200 characters"], },
  shortTitle: { type: String },            // optional shorter label like "Merit List 2025-2026"
  icon: { type: String },                  // URL or icon class name
  content: { type: String },               // full announcement body / description
  category: { type: String, default: 'general' }, // e.g., "Merit List", "Counseling"
startDate: {
  type: Date,
},
endDate: {
  type: Date,
  validate: {
    validator: function (value) {
      // allow if either date is missing
      if (!value || !this.startDate) return true;

      return value >= this.startDate;
    },
    message: "End date must be greater than or equal to start date",
  },
},                 // optional visible-until
  link: {
  type: String,
  match: [
    /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
    "Please enter a valid URL",
  ],
},               // optional link
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

   image: {
    type: String,
    validate: {
      validator: function (value) {
        return /\.(png|jpg|jpeg)$/i.test(value);
      },
      message: "Only PNG and JPG images are allowed",
    },
  },

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
