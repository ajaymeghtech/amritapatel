const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createProgram,
  getAllPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  createProgram
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  updateProgram
);
router.get("/", getAllPrograms);
router.get("/:id", getProgram);
router.delete("/:id", deleteProgram);

module.exports = router;
