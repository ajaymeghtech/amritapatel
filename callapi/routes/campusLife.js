const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createCampusLife,
  getAllCampusLife,
  getCampusLifeById,
  updateCampusLife,
  deleteCampusLife
} = require("../controllers/campusLifeController");

// Ensure upload folder exists
const uploadPath = "uploads/campus";
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
router.get("/", getAllCampusLife);
router.get("/:id", getCampusLifeById);
router.post("/", upload.single("image"), createCampusLife);
router.put("/:id", upload.single("image"), updateCampusLife);
router.delete("/:id", deleteCampusLife);

module.exports = router;
