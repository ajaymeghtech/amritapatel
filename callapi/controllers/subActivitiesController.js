const subActivities = require("../models/subActivities");

// CREATE
exports.createsubActivities = async (req, res) => {
  try {
    let body = { ...req.body };

    if (req.files?.image) {
      body.image = `/uploads/subActivities/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      body.applynow = `/uploads/subActivities/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      body.view_details = `/uploads/subActivities/${req.files.view_details[0].filename}`;
    }

    const data = await subActivities.create(body);

    res.status(201).json({
      status: true,
      message: "subActivities created successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// LIST
exports.getAllsubActivities = async (req, res) => {
  try {
    const data = await subActivities.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "subActivities list fetched",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// SINGLE
exports.getsubActivitiesById = async (req, res) => {
  try {
    const data = await subActivities.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "subActivities not found"
      });
    }

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updatesubActivities = async (req, res) => {
  try {
    let update = { ...req.body };

    if (req.files?.image) {
      
      update.image = `/uploads/subActivities/${req.files.image[0].filename}`;
    }

    if (req.files?.applynow) {
      update.applynow = `/uploads/subActivities/${req.files.applynow[0].filename}`;
    }

    if (req.files?.view_details) {
      update.view_details = `/uploads/subActivities/${req.files.view_details[0].filename}`;
    }

    const data = await subActivities.findByIdAndUpdate(req.params.id, update, {
      new: true
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "subActivities not found"
      });
    }

    res.json({
      status: true,
      message: "subActivities updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deletesubActivities = async (req, res) => {
  try {
    const data = await subActivities.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "subActivities not found"
      });
    }

    res.json({
      status: true,
      message: "subActivities deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
