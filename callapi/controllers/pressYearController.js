const PressYear = require("../models/PressYear");

// Create Press Year
const createPressYear = async (req, res) => {
  try {
    const { year } = req.body;

    const data = await PressYear.create({ year });

    res.json({
      status: true,
      message: "Press year created successfully",
      data
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "This press year already exists"
      });
    }

    res.status(500).json({
      status: false,
      message: "Error creating press year",
      error: err.message
    });
  }
};

// Get all Press Years
const getPressYears = async (req, res) => {
  try {
    const list = await PressYear.find().sort({ year: -1 });

    res.json({
      status: true,
      message: "Press years fetched successfully",
      data: list
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching press years",
      error: err.message
    });
  }
};

// Get Single Press Year
const getPressYearById = async (req, res) => {
  try {
    const year = await PressYear.findById(req.params.id);

    if (!year) {
      return res.status(404).json({
        status: false,
        message: "Press year not found"
      });
    }

    res.json({
      status: true,
      message: "Press year fetched successfully",
      data: year
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching press year",
      error: err.message
    });
  }
};

// Update Press Year
const updatePressYear = async (req, res) => {
  try {
    const { year } = req.body;

    const updated = await PressYear.findByIdAndUpdate(
      req.params.id,
      { year },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Press year not found"
      });
    }

    res.json({
      status: true,
      message: "Press year updated successfully",
      data: updated
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "This press year already exists"
      });
    }

    res.status(500).json({
      status: false,
      message: "Error updating press year",
      error: err.message
    });
  }
};

// Delete Press Year
const deletePressYear = async (req, res) => {
  try {
    const deleted = await PressYear.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Press year not found"
      });
    }

    res.json({
      status: true,
      message: "Press year deleted successfully",
      data: deleted
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting press year",
      error: err.message
    });
  }
};

module.exports = {
  createPressYear,
  getPressYears,
  getPressYearById,
  updatePressYear,
  deletePressYear
};
