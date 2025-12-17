const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const {
  createStudentLifePDF,
  getStudentLifePDFs,
  deleteStudentLifePDF,
  updateStudentLifePDF
} = require("../controllers/studentLifePDFController");

// Upload path
const uploadPath = "uploads/student-life-pdf";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("pdf"), createStudentLifePDF);
router.get("/", getStudentLifePDFs);
router.put("/:id", upload.single("pdf"), updateStudentLifePDF);
router.delete("/:id", deleteStudentLifePDF);

module.exports = router;
