const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/subActivities/";
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
  createsubActivities,
  getAllsubActivities,
  getsubActivitiesById,
  updatesubActivities,
  deletesubActivities
} = require("../controllers/subActivitiesController");

// Create (multiple files)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
    createsubActivities
);

// List
router.get("/", getAllsubActivities);
// Single
router.get("/:id", getsubActivitiesById);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  updatesubActivities
);

// Delete
router.delete("/:id", deletesubActivities);

module.exports = router;
