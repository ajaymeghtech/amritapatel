const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/careers";
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
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareer,
  deleteCareer
} = require("../controllers/careerController");

// Create (multiple files)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "applynow", maxCount: 1 },
    { name: "view_details", maxCount: 1 },
  ]),
  createCareer
);

// List
router.get("/", getAllCareers);

// Single
router.get("/:id", getCareerById);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "applynow", maxCount: 1 },
    { name: "view_details", maxCount: 1 },
  ]),
  updateCareer
);

// Delete
router.delete("/:id", deleteCareer);

module.exports = router;
