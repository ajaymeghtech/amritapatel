const mongoose = require("mongoose");

const thirdCategoriesSchema = new mongoose.Schema(
  {
    subActivityId: { type: String, required: true },
    title: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },
    image: { type: String, required: true }, 
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.ThirdCategories ||
  mongoose.model("ThirdCategories", thirdCategoriesSchema);

