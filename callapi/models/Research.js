const mongoose = require("mongoose");

const ResearchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    short_description: { type: String },
    description: { type: String },

    researcher: { type: String },

    image: { type: String },  
    pdf: { type: String },    

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", ResearchSchema);
