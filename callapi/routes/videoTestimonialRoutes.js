const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/videoTestimonial/";
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

// Controllers
const {
  createVideoTestimonial,
  getAllVideoTestimonials,
  getVideoTestimonialById, 
  updateVideoTestimonial,
  deleteVideoTestimonial
} = require("../controllers/videoTestimonialController");

// Create (multiple files)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
    createVideoTestimonial
);
    
// List
router.get("/", getAllVideoTestimonials);
// Single
router.get("/:id", getVideoTestimonialById);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  updateVideoTestimonial
);

// Delete
router.delete("/:id", deleteVideoTestimonial);

module.exports = router;
