const AnnouncementYear = require("../models/AnnouncementYear");

// Create Year
const createAnnouncementYear = async (req, res) => {
  try {
    const { year } = req.body;

    const data = await AnnouncementYear.create({ year });

    res.json({
      status: true,
      message: "Announcement year created successfully",
      data
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "This announcement year already exists"
      });
    }

    res.status(500).json({
      status: false,
      message: "Error creating announcement year",
      error: err.message
    });
  }
};


// Get all years
const getAnnouncementYears = async (req, res) => {
  try {
    const list = await AnnouncementYear.find().sort({ year: -1 });

    res.json({
      status: true,
      message: "Announcement years fetched successfully",
      data: list
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching announcement years",
      error: err.message
    });
  }
};


// Get single year
const getAnnouncementYearById = async (req, res) => {
  try {
    const data = await AnnouncementYear.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Announcement year not found"
      });
    }

    res.json({
      status: true,
      message: "Announcement year fetched successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching announcement year",
      error: err.message
    });
  }
};


// Update Year
const updateAnnouncementYear = async (req, res) => {
  try {
    const data = await AnnouncementYear.findByIdAndUpdate(
      req.params.id,
      { year: req.body.year },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Announcement year not found"
      });
    }

    res.json({
      status: true,
      message: "Announcement year updated successfully",
      data
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "This year already exists"
      });
    }

    res.status(500).json({
      status: false,
      message: "Error updating announcement year",
      error: err.message
    });
  }
};


// Delete Year
const deleteAnnouncementYear = async (req, res) => {
  try {
    const deleted = await AnnouncementYear.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Announcement year not found"
      });
    }

    res.json({
      status: true,
      message: "Announcement year deleted successfully",
      data: deleted
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting announcement year",
      error: err.message
    });
  }
};

module.exports = {
  createAnnouncementYear,
  getAnnouncementYears,
  getAnnouncementYearById,
  updateAnnouncementYear,
  deleteAnnouncementYear
};
