const SubAcademic = require("../models/subAcademicModel");
const Academic = require("../models/academicModel");

// CREATE
const createSubAcademic = async (req, res) => {
    
  try {
    const { academicId, title, content, eventType, leadFacilitator, venueAffiliation, coFacilitator, date, existingImages } = req.body;

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

    // Handle single image (backward compatibility)
    const image = req.files?.image?.[0] ? `/uploads/sub-academic/${req.files.image[0].filename}` : null;

    // Handle multiple images
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
        images.push(`/uploads/sub-academic/${file.filename}`);
      });
    }

    const data = await SubAcademic.create({
      academicId,
      title,
      content: content || "",
      image, // Keep for backward compatibility
      images, // Array of images
      eventType: eventType || "",
      leadFacilitator: leadFacilitator || "",
      venueAffiliation: venueAffiliation || "",
      coFacilitator: coFacilitator || "",
      date: date ? new Date(date) : null,
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
    const { academicId, title, content, eventType, leadFacilitator, venueAffiliation, coFacilitator, date, existingImages } = req.body;
    
    // Get existing record to preserve images
    const existing = await SubAcademic.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "SubAcademic not found",
      });
    }

    const updatedData = {
      academicId,
      title,
      content: content || "",
      eventType: eventType || "",
      leadFacilitator: leadFacilitator || "",
      venueAffiliation: venueAffiliation || "",
      coFacilitator: coFacilitator || "",
      date: date ? new Date(date) : null,
    };

    // Handle single image (backward compatibility)
    if (req.files?.image?.[0]) {
      updatedData.image = `/uploads/sub-academic/${req.files.image[0].filename}`;
    }

    // Handle multiple images - merge existing with new
    let images = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        images = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // If parsing fails, use existing images from database
        images = existing.images || [];
      }
    } else {
      // If no existingImages provided, keep current images
      images = existing.images || [];
    }

    // Add new uploaded images
    if (req.files?.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        images.push(`/uploads/sub-academic/${file.filename}`);
      });
    }

    updatedData.images = images;

    const updated = await SubAcademic.findByIdAndUpdate(
      req.params.id,
      updatedData,
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
