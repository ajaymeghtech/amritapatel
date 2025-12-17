const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Ensure folder exists
const uploadPath = "uploads/announcements";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

const {
  createAnnouncement,
  getAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// Create (with image)
router.post("/", upload.single("image"), createAnnouncement);

// List
router.get("/", getAllAnnouncements);

// Get single
router.get("/:id", getAnnouncement);

// Update (with image)
router.put("/:id", upload.single("image"), updateAnnouncement);

// Delete
router.delete("/:id", deleteAnnouncement);

module.exports = router;
