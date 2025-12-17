const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const About = require("../models/About");

// Ensure uploads folder exists
const uploadPath = "uploads/about";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Create About Page
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const about = new About({
      ...req.body,
      image: req.file ? `/uploads/about/${req.file.filename}` : null,
      gallery: req.body.gallery ? JSON.parse(req.body.gallery) : [],
      metaKeywords: req.body.metaKeywords ? JSON.parse(req.body.metaKeywords) : [],
    });
    await about.save();
    res.json({ success: true, message: "About page created", data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get All About Pages (with optional status filter)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    const abouts = await About.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: abouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get Single About Page by ID
router.get("/:id", async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ success: false, message: "About page not found" });
    res.json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Update About Page
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? `/uploads/about/${req.file.filename}` : req.body.image,
        gallery: req.body.gallery ? JSON.parse(req.body.gallery) : [],
        metaKeywords: req.body.metaKeywords ? JSON.parse(req.body.metaKeywords) : [],
      },
      { new: true }
    );
    res.json({ success: true, message: "About page updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete About Page
router.delete("/:id", async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "About page deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
