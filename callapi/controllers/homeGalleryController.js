const HomeGallery = require("../models/HomeGallery");

// ✅ Create
const createGalleryItem = async (req, res) => {
  try {
    const galleryData = req.body;

    // if file uploaded (image), add to image field
    if (req.file) {
      galleryData.image = `/uploads/${req.file.filename}`;
    }

    const item = new HomeGallery(galleryData);
    await item.save();

    res.status(201).json({
      status: true,
      message: "Gallery item added successfully",
      data: item,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to add gallery item",
      error: err.message,
    });
  }
};

// ✅ Get All
const getAllGalleryItems = async (req, res) => {
  try {
    const data = await HomeGallery.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      message: "Gallery items fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch gallery items",
      error: err.message,
    });
  }
};

// ✅ Get One
const getGalleryItem = async (req, res) => {
  try {
    const item = await HomeGallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Gallery item not found",
      });
    }
    res.json({
      status: true,
      message: "Gallery item fetched successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch gallery item",
      error: err.message,
    });
  }
};

// ✅ Update
const updateGalleryItem = async (req, res) => {
  try {
    const galleryData = req.body;

    if (req.file) {
      galleryData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await HomeGallery.findByIdAndUpdate(req.params.id, galleryData, { new: true });
    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Gallery item not found",
      });
    }
    res.json({
      status: true,
      message: "Gallery item updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update gallery item",
      error: err.message,
    });
  }
};

// ✅ Delete
const deleteGalleryItem = async (req, res) => {
  try {
    const deleted = await HomeGallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Gallery item not found",
      });
    }
    res.json({
      status: true,
      message: "Gallery item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete gallery item",
      error: err.message,
    });
  }
};

module.exports = {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
