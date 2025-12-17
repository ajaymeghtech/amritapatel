const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/announcement_images";

// Create directory if missing
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

// Controller import
const {
  createAnnouncementImage,
  getAllAnnouncementImages,
  getAnnouncementImageById,
  updateAnnouncementImage,
  deleteAnnouncementImage,
} = require("../controllers/announcementImageController");

// Create
router.post("/", upload.single("image"), createAnnouncementImage);

// List all
router.get("/", getAllAnnouncementImages);

// Single
router.get("/:id", getAnnouncementImageById);

// Update
router.put("/:id", upload.single("image"), updateAnnouncementImage);

// Delete
router.delete("/:id", deleteAnnouncementImage);

module.exports = router;
