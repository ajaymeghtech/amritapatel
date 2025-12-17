const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const {
  createPress,
  getAllPress,
  getPressById,
  updatePress,
  deletePress
} = require("../controllers/pressReleaseController");

// Ensure folder exists
const uploadPath = "uploads/press";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createPress);
router.get("/", getAllPress);
router.get("/:id", getPressById);
router.put("/:id", upload.single("image"), updatePress);
router.delete("/:id", deletePress);

module.exports = router;
