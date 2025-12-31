const FieldTestimonial = require("../models/fieldTestimonialModel");

// CREATE
const createFieldTestimonial = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ status: false, message: "Request body is required" });
    }
    const { title, description, shortDescription, designation, videos, subTestimonials } = req.body;
    if (!title) {
      return res.status(400).json({ status: false, message: "Title is required" });
    }
    let videosArr = [];
    if (videos) {
      try {
        videosArr = JSON.parse(videos);
      } catch {
        videosArr = Array.isArray(videos) ? videos : [];
      }
    }

    let subTestimonialsArr = [];
    if (subTestimonials) {
      try {
        const parsed = JSON.parse(subTestimonials);
        subTestimonialsArr = Array.isArray(parsed) ? parsed : [];
      } catch {
        subTestimonialsArr = [];
      }
    }
    const data = await FieldTestimonial.create({
      title,
      description: description || "",
      shortDescription: shortDescription || "",
      designation: designation || "",
      videos: videosArr,
      subTestimonials: subTestimonialsArr,
    });
    res.status(201).json({ status: true, message: "Field testimonial created", data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating testimonial", error: err.message });
  }
};

// LIST
const getFieldTestimonials = async (_req, res) => {
  try {
    const list = await FieldTestimonial.find().sort({ createdAt: -1 });
    res.json({ status: true, message: "Field testimonials fetched", data: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET BY ID
const getFieldTestimonialById = async (req, res) => {
  try {
    const data = await FieldTestimonial.findById(req.params.id);
    if (!data) return res.status(404).json({ status: false, message: "Field testimonial not found" });
    res.json({ status: true, message: "Field testimonial fetched", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateFieldTestimonial = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ status: false, message: "Request body is required" });
    }
    const { title, description, shortDescription, designation, videos, subTestimonials } = req.body;
    const existing = await FieldTestimonial.findById(req.params.id);
    if (!existing) return res.status(404).json({ status: false, message: "Field testimonial not found" });

    let videosArr = existing.videos || [];
    if (videos) {
      try {
        videosArr = JSON.parse(videos);
      } catch {
        videosArr = Array.isArray(videos) ? videos : existing.videos || [];
      }
    }

    let subTestimonialsArr = existing.subTestimonials || [];
    if (subTestimonials) {
      try {
        const parsed = JSON.parse(subTestimonials);
        subTestimonialsArr = Array.isArray(parsed) ? parsed : existing.subTestimonials || [];
      } catch {
        subTestimonialsArr = existing.subTestimonials || [];
      }
    }

    const updated = await FieldTestimonial.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description: description || "",
        shortDescription: shortDescription || "",
        designation: designation || "",
        videos: videosArr,
        subTestimonials: subTestimonialsArr,
      },
      { new: true }
    );

    res.json({ status: true, message: "Field testimonial updated", data: updated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteFieldTestimonial = async (req, res) => {
  try {
    const deleted = await FieldTestimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Field testimonial not found" });
    res.json({ status: true, message: "Field testimonial deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createFieldTestimonial,
  getFieldTestimonials,
  getFieldTestimonialById,
  updateFieldTestimonial,
  deleteFieldTestimonial,
};

