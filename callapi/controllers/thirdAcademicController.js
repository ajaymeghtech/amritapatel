const ThirdAcademic = require("../models/thirdAcademicModel");

// CREATE
const createThirdAcademic = async (req, res) => {
  try {
    const { title, subAcademicIds, existingImages } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    // Parse subAcademicIds
    let parsedSubAcademicIds = [];
    if (subAcademicIds) {
      try {
        parsedSubAcademicIds = JSON.parse(subAcademicIds);
      } catch (e) {
        parsedSubAcademicIds = Array.isArray(subAcademicIds) ? subAcademicIds : [];
      }
    }

    // Handle existing images
    let images = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        images = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        images = [];
      }
    }

    // Add new uploaded images
    if (req.files?.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        images.push(`/uploads/third-academic/${file.filename}`);
      });
    }

    const data = await ThirdAcademic.create({
      title,
      subAcademicIds: parsedSubAcademicIds,
      images,
    });

    res.status(201).json({
      status: true,
      message: "Third Academic created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating Third Academic",
      error: err.message,
    });
  }
};

// LIST
const getThirdAcademic = async (req, res) => {
  try {
    const list = await ThirdAcademic.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "Third Academic list fetched",
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
const getThirdAcademicById = async (req, res) => {
  try {
    const data = await ThirdAcademic.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Third Academic not found",
      });
    }

    res.json({
      status: true,
      message: "Third Academic fetched successfully",
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
const updateThirdAcademic = async (req, res) => {
  try {
    const { title, subAcademicIds, existingImages } = req.body;
    
    // Get existing record
    const existing = await ThirdAcademic.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Third Academic not found",
      });
    }

    const updatedData = {
      title,
    };

    // Parse subAcademicIds
    if (subAcademicIds) {
      try {
        updatedData.subAcademicIds = JSON.parse(subAcademicIds);
      } catch (e) {
        updatedData.subAcademicIds = Array.isArray(subAcademicIds) ? subAcademicIds : existing.subAcademicIds || [];
      }
    }

    // Handle images - merge existing with new
    let images = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        images = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        images = existing.images || [];
      }
    } else {
      images = existing.images || [];
    }

    // Add new uploaded images
    if (req.files?.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        images.push(`/uploads/third-academic/${file.filename}`);
      });
    }

    updatedData.images = images;

    const updated = await ThirdAcademic.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Third Academic not found",
      });
    }

    res.json({
      status: true,
      message: "Third Academic updated successfully",
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
const deleteThirdAcademic = async (req, res) => {
  try {
    const deleted = await ThirdAcademic.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Third Academic not found",
      });
    }

    res.json({
      status: true,
      message: "Third Academic deleted successfully",
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
  createThirdAcademic,
  getThirdAcademic,
  getThirdAcademicById,
  updateThirdAcademic,
  deleteThirdAcademic,
};

