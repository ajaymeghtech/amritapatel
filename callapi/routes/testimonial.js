const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
} = require("../controllers/testimonialController");

// Ensure upload folder exists
const uploadPath = "uploads/testimonials";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });

// Routes
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);

// ⭐ SAME STYLE LIKE YOUR CAMPUS ROUTER
router.post("/", upload.single("photo"), createTestimonial);
router.put("/:id", upload.single("photo"), updateTestimonial);

router.delete("/:id", deleteTestimonial);

module.exports = router;
