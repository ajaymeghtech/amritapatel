const express = require("express");
const router = express.Router();
const multer = require("multer");

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/about"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const {
  createAboutUs,
  getAboutUs,
  getAboutUsById,
  updateAboutUs,
  deleteAboutUs
} = require("../controllers/aboutUsController");

router.post("/", upload.single("image"), createAboutUs);
router.get("/", getAboutUs);
router.get("/:id", getAboutUsById);
router.put("/:id", upload.single("image"), updateAboutUs);
router.delete("/:id", deleteAboutUs);

module.exports = router;
