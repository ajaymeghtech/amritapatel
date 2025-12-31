const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/field-gallery";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

const {
  createFieldGallery,
  getFieldGallery,
  getFieldGalleryById,
  updateFieldGallery,
  deleteFieldGallery,
} = require("../controllers/fieldGalleryController");

router.post("/", upload.fields([{ name: "images", maxCount: 20 }]), createFieldGallery);
router.get("/", getFieldGallery);
router.get("/:id", getFieldGalleryById);
router.put("/:id", upload.fields([{ name: "images", maxCount: 20 }]), updateFieldGallery);
router.delete("/:id", deleteFieldGallery);

module.exports = router;

