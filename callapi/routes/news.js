const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import controller functions
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

// Ensure upload directory exists
const fs = require("fs");
const path = require("path");
const uploadPath = path.join(__dirname, "..", "uploads", "news");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes with file upload support
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createNews
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateNews
);

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.delete("/:id", deleteNews);

module.exports = router;
