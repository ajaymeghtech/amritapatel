const mongoose = require("mongoose");

const SubAnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }
});

const AnimalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },  
    category: { type: String, required: true }, 
    sub_animals: [SubAnimalSchema] 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animal", AnimalSchema);
