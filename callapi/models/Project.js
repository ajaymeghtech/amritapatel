const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_title: { type: String, required: true },
    client_name: String,
    project_url: String,
    project_type: String,
    technology: String,
    description: String,
    start_date: Date,
    end_date: Date,
    status: String,
    project_image: { type: String},
    priority: String,
    budget: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
