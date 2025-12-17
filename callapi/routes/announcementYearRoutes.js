const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer().none();

const {
  createAnnouncementYear,
  getAnnouncementYears,
  getAnnouncementYearById,
  updateAnnouncementYear,
  deleteAnnouncementYear
} = require("../controllers/announcementYearController");

router.post("/", upload, createAnnouncementYear);
router.get("/", getAnnouncementYears);
router.get("/:id", getAnnouncementYearById);
router.put("/:id", upload, updateAnnouncementYear);
router.delete("/:id", deleteAnnouncementYear);

module.exports = router;
