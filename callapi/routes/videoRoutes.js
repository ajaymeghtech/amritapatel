const express = require("express");
const router = express.Router();
const multer = require("multer");

// this parses form-data WITHOUT files
const upload = multer();

const {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");

// Routes
// use upload.none() anywhere you expect form-data
router.post("/", upload.none(), createVideo);      // Create
router.get("/", getAllVideos);                     // List
router.get("/:id", getVideoById);                  // Get one
router.put("/:id", upload.none(), updateVideo);    // Update
router.delete("/:id", deleteVideo);                // Delete

module.exports = router;
