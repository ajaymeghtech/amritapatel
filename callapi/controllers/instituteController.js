const Institute = require("../models/Institute");

// Create
const createInstitute = async (req, res) => {
  try {
    const item = new Institute({
      name: req.body.name,
      url: req.body.url
    });

    await item.save();

    res.status(201).json({
      status: true,
      message: "Institute created successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get All
const getAllInstitutes = async (req, res) => {
  try {
    const data = await Institute.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Institutes fetched successfully",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get One
const getInstituteById = async (req, res) => {
  try {
    const item = await Institute.findById(req.params.id);

    if (!item)
      return res.status(404).json({ status: false, message: "Institute not found" });

    res.status(200).json({
      status: true,
      message: "Institute fetched successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// Update Institute
const updateInstitute = async (req, res) => {
  try {
    const updated = await Institute.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, url: req.body.url },
      { new: true, runValidators: true }

    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Institute not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Institute updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};


// Delete
const deleteInstitute = async (req, res) => {
  try {
    const deleted = await Institute.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ status: false, message: "Institute not found" });

    res.status(200).json({
      status: true,
      message: "Institute deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createInstitute,
  getAllInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute
};
