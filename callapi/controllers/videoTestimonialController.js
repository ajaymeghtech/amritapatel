const videoTestimonialModel = require("../models/VideoTestimonial");

// CREATE
exports.createVideoTestimonial = async (req, res) => {
  try {
    let body = { ...req.body };

    if (req.files?.image) {
      body.image = `/uploads/videoTestimonial/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      body.applynow = `/uploads/videoTestimonial/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      body.view_details = `/uploads/videoTestimonial/${req.files.view_details[0].filename}`;
    }

    const data = await videoTestimonialModel.create(body);

    res.status(201).json({
      status: true,
      message: "videoTestimonial created successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// LIST
exports.getAllVideoTestimonials = async (req, res) => {
  try {
    const data = await videoTestimonialModel.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "videoTestimonials list fetched",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// SINGLE
exports.getVideoTestimonialById = async (req, res) => {
  try {
    const data = await videoTestimonialModel.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "videoTestimonial not found"
      });
    }

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateVideoTestimonial = async (req, res) => {
  try {
    let update = { ...req.body };

    if (req.files?.image) {
      
      update.image = `/uploads/videoTestimonialModel/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      update.applynow = `/uploads/videoTestimonialModel/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      update.view_details = `/uploads/videoTestimonialModel/${req.files.view_details[0].filename}`;
    }

    const data = await videoTestimonialModel.findByIdAndUpdate(req.params.id, update, {
      new: true
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "videoTestimonial not found"
      });
    }

    res.json({
      status: true,
      message: "videoTestimonial updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteVideoTestimonial = async (req, res) => {
  try {
    const data = await videoTestimonialModel.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "videoTestimonial not found"
      });
    }

    res.json({
      status: true,
      message: "videoTestimonial deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
