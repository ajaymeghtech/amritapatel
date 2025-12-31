const fs = require("fs");
const path = require("path");
const StudentLifeImage = require("../models/StudentLifeImage");
const StudentLife = require("../models/StudentLife");


// Create Student Life Image
exports.createStudentLifeImage = async (req, res) => {
  try {
    const { student_life_id, title, short_description, description, sortOrder } = req.body;

    // Validate required fields
    if (!student_life_id || !title) {
      return res.status(400).json({
        status: false,
        message: "student_life_id and title are required"
      });
    }

    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image file is required"
      });
    }

    const imagePath = `/uploads/student-life-images/${req.file.filename}`;

    // 1️⃣ Create image entry
    const newRecord = await StudentLifeImage.create({
      student_life_id,
      title,
      short_description: short_description || "",
      description: description || "",
      sortOrder: sortOrder || "",
      image: imagePath
    });

    // 2️⃣ Link image with Student Life document
    await StudentLife.findByIdAndUpdate(
      student_life_id,
      { $addToSet: { images: newRecord._id } }, // 👈 prevents duplicates
      { new: true }
    );

    // 3️⃣ Send response
    res.status(201).json({
      status: true,
      message: "Student Life Image created successfully",
      data: newRecord
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.getStudentLifeImages = async (req, res) => {
  try {
    const { student_life_id } = req.query;

    let filter = {};

    // If filter exists, apply it
    if (student_life_id) {
      filter.student_life_id = student_life_id;
    }

    const images = await StudentLifeImage.find(filter);

    res.status(200).json({
      status: true,
      count: images.length,
      filtered: !!student_life_id,
      data: images,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
};




// Get single image by ID
exports.getStudentLifeImageById = async (req, res) => {
  try {
    const image = await StudentLifeImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ status: false, message: "Not found" });
    }

    res.status(200).json({ status: true, data: image });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Image
exports.updateStudentLifeImage = async (req, res) => {
  try {
    const existing = await StudentLifeImage.findById(req.params.id);
    if (!existing) return res.status(404).json({ status: false, message: "Record not found" });

    let imagePath = existing.image;

    if (req.file) {
      // Delete old image
      const oldFilePath = path.join(__dirname, "..", existing.image);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      imagePath = `/uploads/student-life-images/${req.file.filename}`;
    }

    existing.title = req.body.title || existing.title;
    existing.short_description = req.body.short_description !== undefined ? req.body.short_description : existing.short_description;
    existing.description = req.body.description !== undefined ? req.body.description : existing.description;
    existing.sortOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : existing.sortOrder;
    existing.student_life_id = req.body.student_life_id || existing.student_life_id;
    existing.image = imagePath;

    await existing.save();

    res.status(200).json({
      status: true,
      message: "Student Life Image updated successfully",
      data: existing
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Image
exports.deleteStudentLifeImage = async (req, res) => {
  try {
    const image = await StudentLifeImage.findById(req.params.id);
    if (!image) return res.status(404).json({ status: false, message: "Record not found" });

    // Delete actual image file
    const filePath = path.join(__dirname, "..", image.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await StudentLifeImage.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: true, message: "Record deleted successfully" });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
