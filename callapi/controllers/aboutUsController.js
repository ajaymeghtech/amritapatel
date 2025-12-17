const AboutUs = require("../models/AboutUs");

// CREATE
const createAboutUs = async (req, res) => {
  try {
    const { title, short_description, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and content are required",
      });
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // If uploading image (optional)
    const image = req.file ? `/uploads/about/${req.file.filename}` : null;

    const exists = await AboutUs.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "An About Us entry with similar title already exists",
      });
    }

    const data = await AboutUs.create({
      title,
      slug,
      short_description,
      content,
      image,
      status,
    });

    res.status(201).json({
      status: true,
      message: "About Us content created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating About Us content",
      error: err.message,
    });
  }
};

// GET ALL
const getAboutUs = async (req, res) => {
  try {
    const list = await AboutUs.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      message: "About Us fetched successfully",
      data: list,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching About Us data",
      error: err.message,
    });
  }
};

// GET SINGLE
const getAboutUsById = async (req, res) => {
  try {
    const data = await AboutUs.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "About Us entry not found",
      });
    }

    res.json({
      status: true,
      message: "About Us data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching record",
      error: err.message,
    });
  }
};

// UPDATE
const updateAboutUs = async (req, res) => {
  try {
    const updatedData = req.body;

    // If title updated, regenerate slug
    if (req.body.title) {
      updatedData.slug = req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }

    if (req.file) {
      updatedData.image = `/uploads/about/${req.file.filename}`;
    }

    const updated = await AboutUs.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "About Us not found",
      });
    }

    res.json({
      status: true,
      message: "About Us updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating About Us",
      error: err.message,
    });
  }
};

// DELETE
const deleteAboutUs = async (req, res) => {
  try {
    const deleted = await AboutUs.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "About Us not found",
      });
    }

    res.json({
      status: true,
      message: "About Us deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting About Us",
      error: err.message,
    });
  }
};

module.exports = {
  createAboutUs,
  getAboutUs,
  getAboutUsById,
  updateAboutUs,
  deleteAboutUs,
};
