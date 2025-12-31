const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} = require("../controllers/animalController");

// Ensure folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "animals");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// routes
router.post(
  "/",
  upload.fields([{ name: "sub_images", maxCount: 10 }]),
  createAnimal
);

router.put(
  "/:id",
  upload.fields([{ name: "sub_images", maxCount: 10 }]),
  updateAnimal
);

router.get("/", getAllAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", deleteAnimal);

module.exports = router;
