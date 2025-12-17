const fs = require("fs");
const Certification = require("../models/Certification");

// ✅ Create Certification
const createCertification = async (req, res) => {
  try {
    const logoPath = req.file ? `/uploads/certifications/${req.file.filename}` : null;

    if (!req.body.title || !logoPath) {
      return res.status(400).json({
        status: false,
        message: "Title and logo are required",
        data: null,
      });
    }

    const certification = new Certification({
      ...req.body,
      logo: logoPath,
    });

    await certification.save();

    res.status(201).json({
      status: true,
      message: "Certification created successfully",
      data: certification,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create certification",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Get All Certifications (with optional status filter)
const getAllCertifications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const certifications = await Certification.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Certifications fetched successfully",
      data: certifications,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching certifications",
      error: err.message,
      data: [],
    });
  }
};

// ✅ Get Single Certification
const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        status: false,
        message: "Certification not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Certification fetched successfully",
      data: certification,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching certification",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update Certification
const updateCertification = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.logo = `/uploads/certifications/${req.file.filename}`;
    }

    const updated = await Certification.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Certification not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Certification updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update certification",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Delete Certification
const deleteCertification = async (req, res) => {
  try {
    const deleted = await Certification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Certification not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Certification deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete certification",
      error: err.message,
    });
  }
};

module.exports = {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
};
