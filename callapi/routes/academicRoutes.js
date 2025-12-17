const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/academic";
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

// Controller
const {
  createAcademic,
  getAcademic,
  getAcademicById,
  updateAcademic,
  deleteAcademic,
} = require("../controllers/academicController");

// Create
router.post("/", upload.single("image"), createAcademic);

// List
router.get("/", getAcademic);

// Single
router.get("/:id", getAcademicById);

// Update
router.put("/:id", upload.single("image"), updateAcademic);

// Delete
router.delete("/:id", deleteAcademic);

module.exports = router;
