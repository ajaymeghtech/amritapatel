const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  createFieldTestimonial,
  getFieldTestimonials,
  getFieldTestimonialById,
  updateFieldTestimonial,
  deleteFieldTestimonial,
} = require("../controllers/fieldTestimonialController");

// Multer middleware to parse FormData (no file upload, just form fields)
const upload = multer().none();

router.post("/", upload, createFieldTestimonial);
router.get("/", getFieldTestimonials);
router.get("/:id", getFieldTestimonialById);
router.put("/:id", upload, updateFieldTestimonial);
router.delete("/:id", deleteFieldTestimonial);

module.exports = router;

