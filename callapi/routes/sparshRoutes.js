const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer(); // handle form-data without files

const {
  createSparsh,
  getSparsh,
  getSparshById,
  updateSparsh,
  deleteSparsh,
} = require("../controllers/sparshController");

// Accept form-data (no files)
router.post("/", upload.none(), createSparsh);
router.get("/", getSparsh);
router.get("/:id", getSparshById);
router.put("/:id", upload.none(), updateSparsh);
router.delete("/:id", deleteSparsh);

module.exports = router;

