const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createStudentLifeImage,
  getStudentLifeImages,
  getStudentLifeImageById,
  updateStudentLifeImage,
  deleteStudentLifeImage,
} = require("../controllers/studentLifeImageController");

// Upload folder
const uploadPath = "uploads/student-life-images";

// Create folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createStudentLifeImage);
router.get("/detail/:id", getStudentLifeImageById);
router.get("/", getStudentLifeImages);

router.put("/:id", upload.single("image"), updateStudentLifeImage);
router.delete("/:id", deleteStudentLifeImage);

module.exports = router;
