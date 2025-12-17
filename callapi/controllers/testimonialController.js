const fs = require("fs");
const path = require("path");
const Testimonial = require("../models/testimonial");

// CREATE
const createTestimonial = async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

    const item = new Testimonial({
      name: req.body.name,
      designation: req.body.designation,
      institute: req.body.institute,
      message: req.body.message,
      rating: req.body.rating,
      photo: photoPath,
      status: req.body.status
    });

    await item.save();

    res.status(201).json({
      status: true,
      message: "Testimonial created successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
const getAllTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Testimonials fetched successfully",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
const getTestimonialById = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "Testimonial fetched successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    let photoPath = item.photo;

    // Remove old image if new image uploaded
    if (req.file) {
      if (photoPath) {
        const oldImagePath = path.join(__dirname, "..", photoPath);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      photoPath = `/uploads/testimonials/${req.file.filename}`;
    }

    item.name = req.body.name;
    item.designation = req.body.designation;
    item.institute = req.body.institute;
    item.message = req.body.message;
    item.rating = req.body.rating;
    item.status = req.body.status;
    item.photo = photoPath;

    await item.save();

    res.status(200).json({
      status: true,
      message: "Testimonial updated successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    // Delete image
    if (item.photo) {
      const imagePath = path.join(__dirname, "..", item.photo);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await item.deleteOne();

    res.status(200).json({
      status: true,
      message: "Testimonial deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
};
