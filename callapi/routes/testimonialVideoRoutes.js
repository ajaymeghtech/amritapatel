const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createTestimonialVideo,
  getAllTestimonialVideos,
  getTestimonialVideoById,
  updateTestimonialVideo,
  deleteTestimonialVideo,
} = require("../controllers/testimonialVideoController");

// Ensure upload folder exists
const uploadPath = "uploads/testimonial-videos";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Routes
router.get("/", getAllTestimonialVideos);
router.get("/:id", getTestimonialVideoById);
router.post("/", upload.single("thumbnail"), createTestimonialVideo);
router.put("/:id", upload.single("thumbnail"), updateTestimonialVideo);
router.delete("/:id", deleteTestimonialVideo);

module.exports = router;

