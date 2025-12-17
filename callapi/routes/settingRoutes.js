const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getSettings, updateSettings } = require("../controllers/settingController");

// 🧩 Ensure upload folder exists
const uploadPath = "uploads/settings";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 🧩 Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Routes
router.get("/", getSettings);

// For multiple files: logo and faviconUrl
router.put(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "faviconUrl", maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
