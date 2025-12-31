const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/sub-academic";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

const {
  createSubAcademic,
  getSubAcademic,
  getSubAcademicById,
  updateSubAcademic,
  deleteSubAcademic,
} = require("../controllers/subAcademicController"); 

// Create - support multiple images
router.post("/", upload.fields([{ name: "images", maxCount: 20 }, { name: "image", maxCount: 1 }]), createSubAcademic);

// List
router.get("/", getSubAcademic);

// Single
router.get("/:id", getSubAcademicById);

// Update - support multiple images
router.put("/:id", upload.fields([{ name: "images", maxCount: 20 }, { name: "image", maxCount: 1 }]), updateSubAcademic);

// Delete
router.delete("/:id", deleteSubAcademic);

module.exports = router;






