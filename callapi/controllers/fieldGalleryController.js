const FieldGallery = require("../models/fieldGalleryModel");

// CREATE
const createFieldGallery = async (req, res) => {
  try {
    const { title, description, existingImages } = req.body;
    if (!title) {
      return res.status(400).json({ status: false, message: "Title is required" });
    }

    let images = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        images = Array.isArray(parsed) ? parsed : [];
      } catch {
        images = [];
      }
    }

    if (req.files?.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        images.push(`/uploads/field-gallery/${file.filename}`);
      });
    }

    const data = await FieldGallery.create({
      title,
      description: description || "",
      images,
    });

    res.status(201).json({ status: true, message: "Field gallery created", data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating field gallery", error: err.message });
  }
};

// LIST
const getFieldGallery = async (_req, res) => {
  try {
    const list = await FieldGallery.find().sort({ createdAt: -1 });
    res.json({ status: true, message: "Field gallery list fetched", data: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET BY ID
const getFieldGalleryById = async (req, res) => {
  try {
    const data = await FieldGallery.findById(req.params.id);
    if (!data) return res.status(404).json({ status: false, message: "Field gallery not found" });
    res.json({ status: true, message: "Field gallery fetched successfully", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateFieldGallery = async (req, res) => {
  try {
    const { title, description, existingImages } = req.body;
    const existing = await FieldGallery.findById(req.params.id);
    if (!existing) return res.status(404).json({ status: false, message: "Field gallery not found" });

    let images = existing.images || [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        images = Array.isArray(parsed) ? parsed : existing.images || [];
      } catch {
        images = existing.images || [];
      }
    }

    if (req.files?.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        images.push(`/uploads/field-gallery/${file.filename}`);
      });
    }

    const updated = await FieldGallery.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description: description || "",
        images,
      },
      { new: true }
    );

    res.json({ status: true, message: "Field gallery updated", data: updated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteFieldGallery = async (req, res) => {
  try {
    const deleted = await FieldGallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Field gallery not found" });
    res.json({ status: true, message: "Field gallery deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createFieldGallery,
  getFieldGallery,
  getFieldGalleryById,
  updateFieldGallery,
  deleteFieldGallery,
};

