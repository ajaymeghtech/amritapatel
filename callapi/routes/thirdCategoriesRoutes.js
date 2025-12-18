const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Upload folder
const uploadPath = "uploads/thirdCategories/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Controllers
const {
  createThirdCategories,
  getAllThirdCategories,
  getThirdCategoriesById,
  updateThirdCategories,
  deleteThirdCategories
} = require("../controllers/thirdCategoriesController");

// Create
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  createThirdCategories
);

// List
router.get("/", getAllThirdCategories);
// Single
router.get("/:id", getThirdCategoriesById);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  updateThirdCategories
);

// Delete
router.delete("/:id", deleteThirdCategories);

module.exports = router;

