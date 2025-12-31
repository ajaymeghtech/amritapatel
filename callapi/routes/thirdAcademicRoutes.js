const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/third-academic";
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
  createThirdAcademic,
  getThirdAcademic,
  getThirdAcademicById,
  updateThirdAcademic,
  deleteThirdAcademic,
} = require("../controllers/thirdAcademicController"); 

// Create - support multiple images
router.post("/", upload.fields([{ name: "images", maxCount: 20 }]), createThirdAcademic);

// List
router.get("/", getThirdAcademic);

// Single
router.get("/:id", getThirdAcademicById);

// Update - support multiple images
router.put("/:id", upload.fields([{ name: "images", maxCount: 20 }]), updateThirdAcademic);

// Delete
router.delete("/:id", deleteThirdAcademic);

module.exports = router;

