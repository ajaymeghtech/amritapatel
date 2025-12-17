const express = require("express");
const router = express.Router();
const multer = require("multer");

// Upload folder setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/research"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const {
  createResearch,
  getResearch,
  getResearchById,
  updateResearch,
  deleteResearch,
} = require("../controllers/researchController");

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createResearch
);

router.get("/", getResearch);
router.get("/:id", getResearchById);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateResearch
);

router.delete("/:id", deleteResearch);

module.exports = router;
