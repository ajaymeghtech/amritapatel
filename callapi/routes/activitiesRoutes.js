const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/activities";
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
  createActivities,
  getActivities,
  getActivitiesById,
  updateActivities,
  deleteActivities
} = require("../controllers/activitiesController");

// Create (multiple files)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "applynow", maxCount: 1 },
    { name: "view_details", maxCount: 1 },
  ]),
  createActivities
);

// List
router.get("/", getActivities);
// Single
router.get("/:id", getActivitiesById);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "applynow", maxCount: 1 },
    { name: "view_details", maxCount: 1 },
  ]),
  updateActivities
);

// Delete
router.delete("/:id", deleteActivities);

module.exports = router;
