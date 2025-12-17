const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/homeGalleryController");

// setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// routes
router.post("/", upload.single("image"), createGalleryItem);
router.get("/", getAllGalleryItems);
router.get("/:id", getGalleryItem);
router.put("/:id", upload.single("image"), updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

module.exports = router;
