const Setting = require("../models/Setting");
const fs = require("fs");
const path = require("path");

// ✅ Get Settings (always one document)
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({
      status: true,
      message: "Settings fetched successfully",
      data: settings,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch settings",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update Settings (handle logo + favicon)
const updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const existing = await Setting.findOne();

    // Handle logo upload
    if (req.files?.logo && req.files.logo.length > 0) {
      updateData.logo = `/uploads/settings/${req.files.logo[0].filename}`;

      // Delete old logo
      if (existing?.logo) {
        const oldLogoPath = path.join(__dirname, "../..", existing.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }
    }

    // Handle favicon upload
    if (req.files?.faviconUrl && req.files.faviconUrl.length > 0) {
      updateData.faviconUrl = `/uploads/settings/${req.files.faviconUrl[0].filename}`;

      // Delete old favicon
      if (existing?.faviconUrl) {
        const oldFaviconPath = path.join(__dirname, "../..", existing.faviconUrl);
        if (fs.existsSync(oldFaviconPath)) fs.unlinkSync(oldFaviconPath);
      }
    }

    const updated = await Setting.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Settings updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update settings",
      error: err.message,
      data: null,
    });
  }
};

module.exports = { getSettings, updateSettings };
