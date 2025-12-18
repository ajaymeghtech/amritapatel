const thirdCategories = require("../models/thirdCategories");

// CREATE
exports.createThirdCategories = async (req, res) => {
  try {
    let body = { ...req.body };

    if (req.files?.image) {
      body.image = `/uploads/thirdCategories/${req.files.image[0].filename}`;
    }

    const data = await thirdCategories.create(body);

    res.status(201).json({
      status: true,
      message: "Third category created successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// LIST
exports.getAllThirdCategories = async (req, res) => {
  try {
    const data = await thirdCategories.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "Third categories list fetched",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// SINGLE
exports.getThirdCategoriesById = async (req, res) => {
  try {
    const data = await thirdCategories.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Third category not found"
      });
    }

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateThirdCategories = async (req, res) => {
  try {
    let update = { ...req.body };

    // Only update image if a new file is provided
    if (req.files?.image && req.files.image[0]) {
      update.image = `/uploads/thirdCategories/${req.files.image[0].filename}`;
    }

    // Remove image from update if it's not being changed (to preserve existing)
    if (!req.files?.image) {
      delete update.image;
    }

    const data = await thirdCategories.findByIdAndUpdate(req.params.id, update, {
      new: true
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Third category not found"
      });
    }

    res.json({
      status: true,
      message: "Third category updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteThirdCategories = async (req, res) => {
  try {
    const data = await thirdCategories.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Third category not found"
      });
    }

    res.json({
      status: true,
      message: "Third category deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

