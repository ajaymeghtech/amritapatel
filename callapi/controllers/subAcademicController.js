const SubAcademic = require("../models/subAcademicModel");
const Academic = require("../models/academicModel");

// CREATE
const createSubAcademic = async (req, res) => {
    
  try {
    const { academicId, title, content, status } = req.body;

    if (!academicId || !title) {
      return res.status(400).json({
        status: false,
        message: "academicId & title are required",
      });
    }

    const exists = await Academic.findById(academicId);
    if (!exists) {
      return res.status(404).json({
        status: false,
        message: "Invalid academicId", 
      });
    }

    const data = await SubAcademic.create({
      academicId,
      title,
      content,
      status,
    });

    res.status(201).json({
      status: true,
      message: "SubAcademic created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating SubAcademic",
      error: err.message,
    });
  }
};

// LIST
const getSubAcademic = async (req, res) => {
  try {
    const list = await SubAcademic.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "SubAcademic list fetched",
      data: list,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// GET BY ID
const getSubAcademicById = async (req, res) => {
  try {
    const data = await SubAcademic.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "SubAcademic not found",
      });
    }

    res.json({
      status: true,
      message: "SubAcademic fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// UPDATE
const updateSubAcademic = async (req, res) => {
  try {
    const updated = await SubAcademic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "SubAcademic not found",
      });
    }

    res.json({
      status: true,
      message: "SubAcademic updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// DELETE
const deleteSubAcademic = async (req, res) => {
  try {
    const deleted = await SubAcademic.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "SubAcademic not found",
      });
    }

    res.json({
      status: true,
      message: "SubAcademic deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createSubAcademic,
  getSubAcademic,
  getSubAcademicById,
  updateSubAcademic,
  deleteSubAcademic,
};
