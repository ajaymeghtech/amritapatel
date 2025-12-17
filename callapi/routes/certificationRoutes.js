const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
} = require("../controllers/certificationController");

// 📁 Ensure upload folder exists
const uploadPath = "uploads/certifications";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 📁 Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("logo"), createCertification);
router.get("/", getAllCertifications);
router.get("/:id", getCertificationById);
router.put("/:id", upload.single("logo"), updateCertification);
router.delete("/:id", deleteCertification);

module.exports = router;
