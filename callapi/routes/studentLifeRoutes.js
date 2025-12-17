const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer().none();

const {
  createStudentLife,
  getStudentLife,
  getStudentLifeById,
  updateStudentLife,
  deleteStudentLife
} = require("../controllers/studentLifeController");

router.post("/", upload, createStudentLife);
router.get("/", getStudentLife);
router.get("/:id", getStudentLifeById);
router.put("/:id", upload, updateStudentLife);
router.delete("/:id", deleteStudentLife);

module.exports = router;
