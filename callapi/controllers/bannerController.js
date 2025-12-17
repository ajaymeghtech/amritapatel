const fs = require("fs");
const Banner = require("../models/Banner");

// ✅ Create Banner
const createBanner = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/banners/${req.file.filename}` : null;

    if (!req.body.title || !imagePath) {
      return res.status(400).json({
        status: false,
        message: "Title and image are required",
        data: null,
      });
    }

    const banner = new Banner({ ...req.body, image: imagePath });
    await banner.save();

    res.status(201).json({
      status: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create banner",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Get All Banners (with filters)
const getAllBanners = async (req, res) => {
  try {
    const { status, position } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (position) filter.position = position;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    if (!banners.length) {
      return res.status(200).json({
        status: false,
        message: "No banners found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Banners fetched successfully",
      data: banners,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching banners",
      error: err.message,
      data: [],
    });
  }
};

// ✅ Get Single Banner
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner fetched successfully",
      data: banner,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching banner",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update Banner
const updateBanner = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/banners/${req.file.filename}`;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update banner",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Delete Banner
const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete banner",
      error: err.message,
    });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
