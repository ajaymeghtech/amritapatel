const ResearchSubcategory = require("../models/ResearchSubcategory");
const Research = require("../models/Research");

// CREATE
exports.createSubcategory = async (req, res) => {
  try {
    const { name, short_description, description, research_id,link } = req.body;

    if (!name || !research_id) {
      return res.status(400).json({
        status: false,
        message: "Name and Research ID are required"
      });
    }

    // Upload image
    const image = req.file
      ? `/uploads/research/subcategory/${req.file.filename}`
      : null;

    const data = await ResearchSubcategory.create({
      name,
      
      short_description,
      description,
      research_id,
      image
    });

    res.status(201).json({
      status: true,
      message: "Subcategory created successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating subcategory",
      error: error.message
    });
  }
};

// GET ALL (with research info)
exports.getSubcategories = async (req, res) => {
  try {
    const list = await ResearchSubcategory.find()
      .populate("research_id", "title slug")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "Subcategories fetched",
      data: list
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching subcategories",
      error: error.message
    });
  }
};

// GET BY ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const data = await ResearchSubcategory.findById(req.params.id)
      .populate("research_id", "title slug");

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found"
      });
    }

    res.json({
      status: true,
      message: "Subcategory fetched successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching record",
      error: error.message
    });
  }
};

// UPDATE
exports.updateSubcategory = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.file) {
      updatedData.image = `/uploads/research/subcategory/${req.file.filename}`;
    }

    const updated = await ResearchSubcategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found"
      });
    }

    res.json({
      status: true,
      message: "Subcategory updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating",
      error: error.message
    });
  }
};

// DELETE
exports.deleteSubcategory = async (req, res) => {
  try {
    const deleted = await ResearchSubcategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found"
      });
    }

    res.json({
      status: true,
      message: "Subcategory deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting",
      error: error.message
    });
  }
};
