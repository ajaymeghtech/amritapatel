const Video = require("../models/Video");

// ✅ Create Video
const createVideo = async (req, res) => {
  try {
    // req.body might be undefined if body parser is not working,
    // so we default to an empty object
    const { title, link, date, status } = req.body || {};

    if (!title || !link) {
      return res.status(400).json({
        status: false,
        message: "Title and link are required",
        data: null,
      });
    }

    const video = new Video({
      title,
      link,
      date,   // optional – will use default if not provided
      status, // optional – will use default if not provided
    });

    await video.save();

    res.status(201).json({
      status: true,
      message: "Video created successfully",
      data: video,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create video",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Get All Videos (with optional status filter)
const getAllVideos = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const videos = await Video.find(filter).sort({ date: -1, createdAt: -1 });

    if (!videos.length) {
      return res.status(200).json({
        status: false,
        message: "No videos found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching videos",
      error: err.message,
      data: [],
    });
  }
};

// ✅ Get Single Video
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Video fetched successfully",
      data: video,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching video",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update Video
const updateVideo = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const updated = await Video.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Video updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update video",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Delete Video
const deleteVideo = async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Video not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Video deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete video",
      error: err.message,
    });
  }
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
