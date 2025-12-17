const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure folder exists
const uploadPath = path.join("uploads/research/subcategory");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory
} = require("../controllers/researchSubcategoryController");

router.post("/", upload.single("image"), createSubcategory);
router.get("/", getSubcategories);
router.get("/:id", getSubcategoryById);
router.put("/:id", upload.single("image"), updateSubcategory);
router.delete("/:id", deleteSubcategory);

module.exports = router;
