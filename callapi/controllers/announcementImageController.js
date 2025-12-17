const AnnouncementImage = require("../models/AnnouncementImage");
const Announcement = require("../models/Announcement");
const mongoose = require("mongoose");

// CREATE
exports.createAnnouncementImage = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.image = `/uploads/announcement_images/${req.file.filename}`;
    }

    const data = await AnnouncementImage.create(body);

    res.status(201).json({
      status: true,
      message: "Announcement image created successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// LIST WITH ANNOUNCEMENT DETAILS
exports.getAllAnnouncementImages = async (req, res) => {
  try {
    const { announcement_id } = req.query;
    const pipeline = [];

    if (announcement_id) {
      pipeline.push({
        $match: { announcement_id: new mongoose.Types.ObjectId(announcement_id) },
      });
    }

    pipeline.push({
      $lookup: {
        from: "announcements",
        localField: "announcement_id",
        foreignField: "_id",
        as: "announcement_details",
      },
    });

    const data = await AnnouncementImage.aggregate(pipeline);

    res.json({ status: true, message: "Fetched", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET SINGLE WITH ANNOUNCEMENT DETAILS
exports.getAnnouncementImageById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await AnnouncementImage.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "announcements",
          localField: "announcement_id",
          foreignField: "_id",
          as: "announcement_details"
        }
      }
    ]);

    res.json({ status: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// UPDATE
exports.updateAnnouncementImage = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await AnnouncementImage.findById(id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Announcement image not found",
      });
    }

    const body = { ...req.body };

    if (req.file) {
      body.image = `/uploads/announcement_images/${req.file.filename}`;
    }

    const updated = await AnnouncementImage.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.json({
      status: true,
      message: "Announcement image updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteAnnouncementImage = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await AnnouncementImage.findById(id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Announcement image not found",
      });
    }

    await AnnouncementImage.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "Announcement image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};