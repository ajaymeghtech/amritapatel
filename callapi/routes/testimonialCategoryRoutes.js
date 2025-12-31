const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createTestimonialCategory,
  getAllTestimonialCategories,
  getTestimonialCategoryById,
  updateTestimonialCategory,
  deleteTestimonialCategory,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  addVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
} = require("../controllers/testimonialCategoryController");

// Multer for form-data parsing (no file upload needed for categories)
const upload = multer().none();

// Ensure upload folders exist
const testimonialUploadPath = "uploads/testimonials";
const videoUploadPath = "uploads/testimonial-videos";
if (!fs.existsSync(testimonialUploadPath)) {
  fs.mkdirSync(testimonialUploadPath, { recursive: true });
}
if (!fs.existsSync(videoUploadPath)) {
  fs.mkdirSync(videoUploadPath, { recursive: true });
}

// Multer storage for testimonials
const testimonialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, testimonialUploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Multer storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoUploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const testimonialUpload = multer({ storage: testimonialStorage });
const videoUpload = multer({ storage: videoStorage });

// Category Routes
router.get("/", getAllTestimonialCategories);
router.get("/:id", getTestimonialCategoryById);
router.post("/", upload, createTestimonialCategory);
router.put("/:id", upload, updateTestimonialCategory);
router.delete("/:id", deleteTestimonialCategory);

// Testimonial Routes (Nested)
router.get("/testimonials/all", getAllTestimonials);
router.post("/:categoryId/testimonials", testimonialUpload.single("photo"), addTestimonial);
router.put("/:categoryId/testimonials/:testimonialId", testimonialUpload.single("photo"), updateTestimonial);
router.delete("/:categoryId/testimonials/:testimonialId", deleteTestimonial);

// Video Routes (Nested)
router.get("/videos/all", getAllVideos);
router.post("/:categoryId/videos", videoUpload.single("thumbnail"), addVideo);
router.put("/:categoryId/videos/:videoId", videoUpload.single("thumbnail"), updateVideo);
router.delete("/:categoryId/videos/:videoId", deleteVideo);

module.exports = router;

