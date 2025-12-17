const PressRelease = require("../models/PressRelease");

// CREATE
const createPress = async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/press/${req.file.filename}`
      : null;

    if (!req.body.title || !req.body.press_year_id || !imagePath) {
      return res.status(400).json({
        status: false,
        message: "Title,press_year_id & image are required",
        data: null
      });
    }

    const press = new PressRelease({
      ...req.body,
      image: imagePath
    });

    await press.save();

    res.status(201).json({
      status: true,
      message: "Press release created successfully",
      data: press
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create press release",
      error: err.message
    });
  }
};

// GET ALL
const getAllPress = async (req, res) => {
  try {
    const { year, status, press_year_id = "" } = req.query;

    const filter = {};
    if (year) filter.year = year;
    if (status) filter.status = status;
    if (press_year_id !== "") filter.press_year_id = press_year_id;

    const pressList = await PressRelease.find(filter).populate('press_year_id').sort({
      order: 1,
      createdAt: -1
    }).populate('press_year_id');

    res.status(200).json({
      status: true,
      message: "Press releases fetched successfully",
      data: pressList
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching press releases",
      error: err.message
    });
  }
};

// GET BY ID
const getPressById = async (req, res) => {
  try {
    const press = await PressRelease.findById(req.params.id).populate('press_year_id');

    if (!press) {
      return res.status(404).json({
        status: false,
        message: "Press release not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Press release fetched successfully",
      data: press
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching press release",
      error: err.message
    });
  }
};

// UPDATE
const updatePress = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/press/${req.file.filename}`;
    }

    const updated = await PressRelease.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('press_year_id');
    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Press release not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Press release updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update press release",
      error: err.message
    });
  }
};

// DELETE
const deletePress = async (req, res) => {
  try {
    const deleted = await PressRelease.findByIdAndDelete(req.params.id).populate('press_year_id');

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Press release not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Press release deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete press release",
      error: err.message
    });
  }
};

module.exports = {
  createPress,
  getAllPress,
  getPressById,
  updatePress,
  deletePress
};
