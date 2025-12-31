const fs = require("fs");
const path = require("path");
const Testimonial = require("../models/testimonialModel");

// CREATE
exports.createTestimonial = async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

    const testimonial = new Testimonial({
      category_id: req.body.category_id,
      name: req.body.name,
      designation: req.body.designation,
      institute: req.body.institute,
      message: req.body.message,
      rating: req.body.rating,
      photo: photoPath,
      status: req.body.status || "active",
      sortOrder: req.body.sortOrder || 0,
    });

    await testimonial.save();

    res.status(201).json({
      status: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
exports.getAllTestimonials = async (req, res) => {
  try {
    const { category_id } = req.query;
    let filter = {};

    if (category_id) {
      filter.category_id = category_id;
    }

    const data = await Testimonial.find(filter)
      .populate("category_id", "title")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Testimonials fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
exports.getTestimonialById = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id).populate("category_id", "title");

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "Testimonial fetched successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateTestimonial = async (req, res) => {
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

    item.category_id = req.body.category_id || item.category_id;
    item.name = req.body.name || item.name;
    item.designation = req.body.designation !== undefined ? req.body.designation : item.designation;
    item.institute = req.body.institute !== undefined ? req.body.institute : item.institute;
    item.message = req.body.message || item.message;
    item.rating = req.body.rating !== undefined ? req.body.rating : item.rating;
    item.status = req.body.status || item.status;
    item.sortOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : item.sortOrder;
    item.photo = photoPath;

    await item.save();

    res.status(200).json({
      status: true,
      message: "Testimonial updated successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteTestimonial = async (req, res) => {
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
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
