const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({

  // Basic Info
  siteName: { type: String, default: "Bhaikaka University" },
  logo: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },

  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },

  currency: { type: String, default: "INR" },
  map: { type: String, default: "" },
  primaryColor: { type: String, default: "" },
  secondaryColor: { type: String, default: "" },

  shippingFlatRate: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },

  // Contact Info 
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  emailPrimary: { type: String, default: "" },
  emailAdmission: { type: String, default: "" },
  emailVerification: { type: String, default: "" },

  // Social Links (Old + New Names)
  facebook: { type: String, default: "" },
  facebookUrl: { type: String, default: "" },
  twitter: { type: String, default: "" },
  twitterUrl: { type: String, default: "" },
  instagram: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  youtube: { type: String, default: "" },
  youtubeUrl: { type: String, default: "" },

  // Contact details
  contactEmail: { type: String },
  contactPhone: { type: String },
  contactAddress: { type: String },
  contactMap: { type: String },
  contactMapEmbed: { type: String },


  // Contact details of amrita patel
  contactEmailAmrita: { type: String },
  contactPhoneAmrita: { type: String },
  contactAddressAmrita: { type: String },
  contactTimeAmrita: { type: String },

  // Footer Section
  footerText: { type: String, default: "© Bhaikaka University. All rights reserved." },

  updatedAt: { type: Date, default: Date.now },
});

// Auto timestamp
SettingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Setting", SettingSchema);
