const fs = require("fs");
const path = require("path");
const CampusLife = require("../models/CampusLife");

// CREATE
const createCampusLife = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/campus/${req.file.filename}` : null;

    const item = new CampusLife({
      title: req.body.title,
      description: req.body.description,
      image: imagePath,
      status: req.body.status
    });

    await item.save();

    res.status(201).json({
      status: true,
      message: "Campus Life item created successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
const getAllCampusLife = async (req, res) => {
  try {
    const data = await CampusLife.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Campus Life fetched successfully",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
const getCampusLifeById = async (req, res) => {
  try {
    const item = await CampusLife.findById(req.params.id);

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "Campus Life item fetched successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateCampusLife = async (req, res) => {
  try {
    const item = await CampusLife.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    let imagePath = item.image;

    // If new image uploaded, delete old image
    if (req.file) {
      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imagePath = `/uploads/campus/${req.file.filename}`;
    }

    item.title = req.body.title;
    item.description = req.body.description;
    item.status = req.body.status;
    item.image = imagePath;

    await item.save();

    res.status(200).json({
      status: true,
      message: "Campus Life updated successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteCampusLife = async (req, res) => {
  try {
    const item = await CampusLife.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    // Remove image from server
    if (item.image) {
      const imgPath = path.join(__dirname, "..", item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await item.deleteOne();

    res.status(200).json({
      status: true,
      message: "Campus Life item deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createCampusLife,
  getAllCampusLife,
  getCampusLifeById,
  updateCampusLife,
  deleteCampusLife
};
