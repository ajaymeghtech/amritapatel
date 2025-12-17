const mongoose = require("mongoose");

const subActivitiesSchema = new mongoose.Schema(
  {
    activityId: { type: String, required: true },  // OK
    title: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },
    image: { type: String ,required: true}, 
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.SubActivities ||
  mongoose.model("SubActivities", subActivitiesSchema);
