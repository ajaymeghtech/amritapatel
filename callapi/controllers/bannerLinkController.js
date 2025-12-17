const BannerLink = require("../models/BannerLink");

// ✅ Get all banner links
const getAllBannerLinks = async (req, res) => {
  try {
    const data = await BannerLink.find().sort({ createdAt: -1 });

    if (!data.length) {
      return res.status(200).json({
        status: false,
        message: "No banner links found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner links fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching banner links",
      error: err.message,
    });
  }
};

// ✅ Get single banner link
const getBannerLinkById = async (req, res) => {
  try {
    const data = await BannerLink.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Banner link not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner link fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching banner link",
      error: err.message,
    });
  }
};

// ✅ Create banner link
const createBannerLink = async (req, res) => {
  try {
    const { text, link } = req.body;

    if (!text || !link) {
      return res.status(400).json({
        status: false,
        message: "Text and link are required",
        data: null,
      });
    }

    const newLink = new BannerLink({ text, link });
    await newLink.save();

    res.status(201).json({
      status: true,
      message: "Banner link added successfully",
      data: newLink,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to add banner link",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update banner link
const updateBannerLink = async (req, res) => {
  try {
    const { text, link } = req.body;

    const updated = await BannerLink.findByIdAndUpdate(
      req.params.id,
      { text, link },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Banner link not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner link updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update banner link",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Delete banner link
const deleteBannerLink = async (req, res) => {
  try {
    const deleted = await BannerLink.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Banner link not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Banner link deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while deleting banner link",
      error: err.message,
    });
  }
};

module.exports = {
  getAllBannerLinks,
  getBannerLinkById,
  createBannerLink,
  updateBannerLink,
  deleteBannerLink,
};
