const mongoose = require("mongoose");

const ResearchSubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    short_description: { type: String },
    description: { type: String },

    link: { type: String },

    image: { type: String },

    research_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Research",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResearchSubcategory", ResearchSubcategorySchema);
