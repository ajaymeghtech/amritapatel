const fs = require("fs");
const path = require("path");
const TestimonialVideo = require("../models/testimonialVideoModel");

// CREATE
exports.createTestimonialVideo = async (req, res) => {
  try {
    const thumbnailPath = req.file ? `/uploads/testimonial-videos/${req.file.filename}` : null;

    const video = new TestimonialVideo({
      category_id: req.body.category_id,
      title: req.body.title,
      video_url: req.body.video_url,
      thumbnail: thumbnailPath,
      description: req.body.description || "",
      status: req.body.status || "active",
      sortOrder: req.body.sortOrder || 0,
    });

    await video.save();

    res.status(201).json({
      status: true,
      message: "Testimonial video created successfully",
      data: video,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
exports.getAllTestimonialVideos = async (req, res) => {
  try {
    const { category_id } = req.query;
    let filter = {};

    if (category_id) {
      filter.category_id = category_id;
    }

    const data = await TestimonialVideo.find(filter)
      .populate("category_id", "title")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Testimonial videos fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
exports.getTestimonialVideoById = async (req, res) => {
  try {
    const item = await TestimonialVideo.findById(req.params.id).populate("category_id", "title");

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "Testimonial video fetched successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateTestimonialVideo = async (req, res) => {
  try {
    const item = await TestimonialVideo.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    let thumbnailPath = item.thumbnail;

    // Remove old thumbnail if new thumbnail uploaded
    if (req.file) {
      if (thumbnailPath) {
        const oldImagePath = path.join(__dirname, "..", thumbnailPath);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      thumbnailPath = `/uploads/testimonial-videos/${req.file.filename}`;
    }

    item.category_id = req.body.category_id || item.category_id;
    item.title = req.body.title || item.title;
    item.video_url = req.body.video_url || item.video_url;
    item.description = req.body.description !== undefined ? req.body.description : item.description;
    item.status = req.body.status || item.status;
    item.sortOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : item.sortOrder;
    item.thumbnail = thumbnailPath;

    await item.save();

    res.status(200).json({
      status: true,
      message: "Testimonial video updated successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteTestimonialVideo = async (req, res) => {
  try {
    const item = await TestimonialVideo.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    // Delete thumbnail
    if (item.thumbnail) {
      const imagePath = path.join(__dirname, "..", item.thumbnail);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await item.deleteOne();

    res.status(200).json({
      status: true,
      message: "Testimonial video deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

