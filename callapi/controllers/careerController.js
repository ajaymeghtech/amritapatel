const Career = require("../models/Career");

// CREATE
exports.createCareer = async (req, res) => {
  try {
    let body = { ...req.body };

    if (req.files?.image) {
      body.image = `/uploads/careers/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      body.applynow = `/uploads/careers/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      body.view_details = `/uploads/careers/${req.files.view_details[0].filename}`;
    }

    const data = await Career.create(body);

    res.status(201).json({
      status: true,
      message: "Career created successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// LIST
exports.getAllCareers = async (req, res) => {
  try {
    const data = await Career.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "Career list fetched",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// SINGLE
exports.getCareerById = async (req, res) => {
  try {
    const data = await Career.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career not found"
      });
    }

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateCareer = async (req, res) => {
  try {
    let update = { ...req.body };

    if (req.files?.image) {
      
      update.image = `/uploads/careers/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      update.applynow = `/uploads/careers/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      update.view_details = `/uploads/careers/${req.files.view_details[0].filename}`;
    }

    const data = await Career.findByIdAndUpdate(req.params.id, update, {
      new: true
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career not found"
      });
    }

    res.json({
      status: true,
      message: "Career updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteCareer = async (req, res) => {
  try {
    const data = await Career.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career not found"
      });
    }

    res.json({
      status: true,
      message: "Career deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
