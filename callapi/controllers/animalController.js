const Animal = require("../models/Animal");

// Create Animal with sub animals
const createAnimal = async (req, res) => {
  try {
    const { title, category, sub_animals } = req.body;

    let parsedSubs = [];

    if (sub_animals) {
      parsedSubs = JSON.parse(sub_animals); // comes as JSON text
    }

    // Handle images if exist
    if (req.files?.sub_images) {
      req.files.sub_images.forEach((file, index) => {
        parsedSubs[index].image = `/uploads/animals/${file.filename}`;
      });
    }

    const animal = new Animal({
      title,
      category,
      sub_animals: parsedSubs
    });

    await animal.save();

    res.status(201).json({
      status: true,
      message: "Animal created successfully",
      data: animal
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating animal",
      error: err.message
    });
  }
};


// Get all animals
const getAllAnimals = async (req, res) => {
  try {
    const list = await Animal.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      message: "Animals fetched successfully",
      data: list
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching animals",
      error: err.message
    });
  }
};


// Get one animal
const getAnimalById = async (req, res) => {
  try {
    const item = await Animal.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Animal not found"
      });
    }
    res.json({
      status: true,
      message: "Animal fetched successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching animal",
      error: err.message
    });
  }
};


// Update animal
const updateAnimal = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.body.sub_animals) {
      updatedData.sub_animals = JSON.parse(req.body.sub_animals);
    }

    if (req.files?.sub_images) {
      req.files.sub_images.forEach((file, index) => {
        updatedData.sub_animals[index].image = `/uploads/animals/${file.filename}`;
      });
    }

    const updated = await Animal.findByIdAndUpdate(req.params.id, updatedData, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Animal not found"
      });
    }

    res.json({
      status: true,
      message: "Animal updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating animal",
      error: err.message
    });
  }
};


// Delete
const deleteAnimal = async (req, res) => {
  try {
    const deleted = await Animal.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Animal not found"
      });
    }
    res.json({
      status: true,
      message: "Animal deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting animal",
      error: err.message
    });
  }
};

module.exports = {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal
};
