const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer().none();

const {
  createPressYear,
  getPressYears,
  getPressYearById,
  updatePressYear,
  deletePressYear
} = require("../controllers/pressYearController");

router.post("/", upload, createPressYear);
router.get("/", getPressYears);
router.get("/:id", getPressYearById);
router.put("/:id", upload, updatePressYear);
router.delete("/:id", deletePressYear);

module.exports = router;
