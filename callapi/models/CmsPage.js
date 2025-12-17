const mongoose = require("mongoose");

const cmsPageSchema = new mongoose.Schema(
  {
    page_key: { type: String, trim: true },
    title: { type: String, trim: true },
    slug: { type: String, trim: true },
    content: { type: String, default: "" },
    description_1: { type: String, default: "" },
    description_2: { type: String, default: "" },
    meta_title: { type: String, default: "" },
    meta_description: { type: String, default: "" },
    meta_keywords: { type: String, default: "" },
    banner_image: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CmsPage", cmsPageSchema);

